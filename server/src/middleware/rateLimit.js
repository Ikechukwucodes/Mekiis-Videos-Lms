import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

const skipInTest = () => env.NODE_ENV === 'test';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTest,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many authentication attempts. Please try again later.'
  }
});

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTest,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many requests. Please slow down.'
  }
});
