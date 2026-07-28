import rateLimit from 'express-rate-limit';
import { HTTP_STATUS } from '../constants/http.constants.js';

/**
 * General API rate limiter — 100 requests per 15 minutes per IP.
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again after 15 minutes.',
    errors: [],
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});

/**
 * Strict rate limiter for auth endpoints — 10 requests per 15 minutes per IP.
 * Prevents brute-force login attacks.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
    errors: [],
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});

export { generalLimiter, authLimiter };
