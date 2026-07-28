import { HTTP_STATUS } from '../constants/http.constants.js';

/**
 * Sends a standardized success response.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {object|Array} [data={}]
 * @param {number} [statusCode=200]
 */
const successResponse = (res, message, data = {}, statusCode = HTTP_STATUS.OK) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Sends a standardized error response.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {Array} [errors=[]]
 * @param {number} [statusCode=500]
 */
const errorResponse = (res, message, errors = [], statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export { successResponse, errorResponse };
