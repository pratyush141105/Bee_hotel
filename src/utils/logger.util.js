import morgan from 'morgan';
import env from '../config/env.config.js';

// Use combined format in production for detailed logs, dev format otherwise
const format = env.isProduction ? 'combined' : 'dev';

const logger = morgan(format);

// Simple console logger for application-level messages
const appLogger = {
  info: (msg, ...args) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, ...args),
};

export { logger as morganLogger };
export default appLogger;
