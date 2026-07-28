import { HTTP_STATUS } from '../constants/http.constants.js';
import { MESSAGES } from '../constants/messages.constants.js';

/**
 * Catch-all handler for routes that do not exist.
 */
const notFound = (req, res, next) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `${MESSAGES.ROUTE_NOT_FOUND}: ${req.method} ${req.originalUrl}`,
    errors: [],
  });
};

export default notFound;
