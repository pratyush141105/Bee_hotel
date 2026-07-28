import dotenv from 'dotenv';
dotenv.config();

const env = {
  port: parseInt(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/hotel_bee',

  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  cookie: {
    name: process.env.COOKIE_NAME || 'hotel_bee_token',
  },

  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  isProduction: process.env.NODE_ENV === 'production',
};

export default env;
