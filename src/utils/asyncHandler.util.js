/**
 * Wraps an async route handler to forward errors to Express's next().
 * Note: express-async-errors also covers this globally, but this utility
 * can be used explicitly for clarity in individual handlers.
 *
 * @param {Function} fn - Async route handler
 * @returns {Function} Wrapped handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
