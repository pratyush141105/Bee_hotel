import env from '../config/env.config.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict',
  secure: env.isProduction, // Secure flag only in production (HTTPS)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

/**
 * Sets the JWT auth cookie on the response.
 * @param {import('express').Response} res
 * @param {string} token
 */
const setCookie = (res, token) => {
  res.cookie(env.cookie.name, token, COOKIE_OPTIONS);
};

/**
 * Clears the JWT auth cookie from the response.
 * @param {import('express').Response} res
 */
const clearCookie = (res) => {
  res.clearCookie(env.cookie.name, {
    httpOnly: true,
    sameSite: 'strict',
    secure: env.isProduction,
  });
};

export { setCookie, clearCookie };
