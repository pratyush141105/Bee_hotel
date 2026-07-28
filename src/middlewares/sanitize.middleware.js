import mongoSanitize from 'express-mongo-sanitize';
// xss-clean is imported as a CommonJS module
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const xss = require('xss-clean');

/**
 * Sanitizes request body, params, and query strings against:
 * 1. MongoDB operator injection ($ and .)
 * 2. XSS attacks (script tags and HTML entities)
 */
const sanitize = [
  mongoSanitize({ replaceWith: '_' }),
  xss(),
];

export default sanitize;
