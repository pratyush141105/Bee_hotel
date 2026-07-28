import app from './app.js';
import connectDB from './database/connect.js';
import env from './config/env.config.js';
import logger from './utils/logger.util.js';

const startServer = async () => {
  // Connect to MongoDB before accepting any requests
  await connectDB();

  const server = app.listen(env.port, () => {
    logger.info(`🚀 Hotel Bee API server running in ${env.nodeEnv} mode on port ${env.port}`);
    logger.info(`📍 API base URL: http://localhost:${env.port}/api/v1`);
  });

  // Graceful shutdown handlers
  const shutdown = (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection:', reason);
    server.close(() => process.exit(1));
  });
};

startServer();
