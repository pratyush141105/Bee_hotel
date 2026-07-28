import mongoose from 'mongoose';
import env from '../config/env.config.js';
import logger from '../utils/logger.util.js';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

const connectDB = async (retryCount = 0) => {
  try {
    const conn = await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      logger.warn(
        `MongoDB connection failed. Retrying in ${RETRY_DELAY_MS / 1000}s... (${retryCount + 1}/${MAX_RETRIES})`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDB(retryCount + 1);
    }
    logger.error('MongoDB connection failed after maximum retries:', error.message);
    process.exit(1);
  }
};

export default connectDB;
