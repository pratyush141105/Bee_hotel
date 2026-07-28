import jwt from 'jsonwebtoken';
import env from '../config/env.config.js';

/**
 * Signs a JWT token with the given payload.
 * @param {object} payload - Data to encode in the token.
 * @returns {string} Signed JWT string.
 */
const signToken = (payload) => {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
};

/**
 * Verifies and decodes a JWT token.
 * @param {string} token - The JWT string to verify.
 * @returns {object} Decoded payload.
 * @throws {JsonWebTokenError | TokenExpiredError}
 */
const verifyToken = (token) => {
  return jwt.verify(token, env.jwt.secret);
};

export { signToken, verifyToken };
