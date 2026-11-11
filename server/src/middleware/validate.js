import mongoose from 'mongoose';
import { ApiError } from '../utils/apiError.js';

export const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const validateObjectIdParam = (paramName) => (req, res, next) => {
  const value = req.params[paramName];
  if (!value || !isObjectId(value)) {
    return next(ApiError.badRequest(`Invalid ${paramName}`));
  }
  next();
};

export const validateBody = (rules) => (req, res, next) => {
  const errors = [];

  for (const [field, rule] of Object.entries(rules)) {
    const value = req.body[field];
    const required = rule.required !== false;

    if (value === undefined || value === null || value === '') {
      if (required) errors.push(`${field} is required`);
      continue;
    }

    if (rule.type === 'string' && typeof value !== 'string') {
      errors.push(`${field} must be a string`);
    }

    if (rule.type === 'number' && typeof value !== 'number' && Number.isNaN(Number(value))) {
      errors.push(`${field} must be a number`);
    }

    if (rule.minLength && String(value).length < rule.minLength) {
      errors.push(`${field} must be at least ${rule.minLength} characters`);
    }

    if (rule.email && !/^\S+@\S+\.\S+$/.test(String(value))) {
      errors.push(`${field} must be a valid email address`);
    }

    if (rule.enum && !rule.enum.includes(value)) {
      errors.push(`${field} must be one of: ${rule.enum.join(', ')}`);
    }
  }

  if (errors.length) {
    return next(ApiError.badRequest('Validation failed', errors));
  }

  next();
};
