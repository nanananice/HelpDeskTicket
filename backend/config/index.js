import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  databaseUrl: process.env.DATABASE_URL,
  environment: process.env.NODE_ENV || 'development',
};
