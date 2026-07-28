import { HTTP_STATUS } from '../constants/http.constants.js';
import AppError from '../errors/AppError.js';
import ValidationError from '../errors/ValidationError.js';
import logger from '../utils/logger.util.js';
import env from '../config/env.config.js';

/**
 * Handles Mongoose CastError (invalid ObjectId format).
 */
const handleCastError = (err) =>
  new AppError(`Invalid value for field: ${err.path}`, HTTP_STATUS.BAD_REQUEST);

/**
 * Handles Mongoose duplicate key errors (code 11000).
 */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue || {})[0] || 'field';
  return new AppError(
    `Duplicate value for ${field}. Please use a different value.`,
    HTTP_STATUS.CONFLICT
  );
};

/**
 * Handles Mongoose validation errors (required, min, max, enum).
 */
const handleMongooseValidationError = (err) => {
  const errors = Object.values(err.errors).map((e) => ({
    field: e.path,
    message: e.message,
  }));
  const ve = new ValidationError(errors);
  return ve;
};

/**
 * Handles JWT invalid signature.
 */
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', HTTP_STATUS.UNAUTHORIZED);

/**
 * Handles JWT token expiry.
 */
const handleJWTExpiredError = () =>
  new AppError('Your session has expired. Please log in again.', HTTP_STATUS.UNAUTHORIZED);

/**
 * Centralized error handling middleware.
 * Converts all error types into a consistent JSON response shape.
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Transform known error types
  if (err.name === 'CastError') error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateKeyError(err);
  if (err.name === 'ValidationError' && !err.isValidationError) {
    error = handleMongooseValidationError(err);
  }
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = error.message || 'An unexpected error occurred.';

  // Log only 500-level errors
  if (statusCode >= 500) {
    logger.error('Unhandled error:', err);
  }

  const response = {
    success: false,
    message,
    errors: error.errors || [],
  };

  // Include stack trace only in development
  if (!env.isProduction && !error.isOperational) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
