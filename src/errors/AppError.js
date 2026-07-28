import { HTTP_STATUS } from '../constants/http.constants.js';

/**
 * Base custom error class for all application-level errors.
 * Extends native Error and adds statusCode + isOperational flag.
 */
class AppError extends Error {
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes known errors from unexpected bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
