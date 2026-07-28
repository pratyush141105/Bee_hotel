import AppError from './AppError.js';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { MESSAGES } from '../constants/messages.constants.js';

/**
 * Specialized error for Zod validation failures.
 * Carries a structured array of field-level errors.
 */
class ValidationError extends AppError {
  constructor(errors = []) {
    super(MESSAGES.VALIDATION_ERROR, HTTP_STATUS.UNPROCESSABLE_ENTITY);
    this.errors = errors; // Array of { field, message } objects
    this.isValidationError = true;
  }
}

export default ValidationError;
