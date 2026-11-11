import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';

const JWT_SECRET = process.env.JWT_SECRET || '';

if (NODE_ENV === 'production' && (!JWT_SECRET || JWT_SECRET.length < 32)) {
  throw new Error('JWT_SECRET must be set to a strong value (32+ characters) in production');
}

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: JWT_SECRET || 'dev-only-jwt-secret-change-before-production-use',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGO_DATA_DIR: process.env.MONGO_DATA_DIR || path.resolve(process.cwd(), '.mongo-data')
};
