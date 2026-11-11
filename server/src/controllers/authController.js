import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../utils/token.js';

export const authController = {
  /**
   * Register a new user (defaults to STUDENT; can allow ADMIN if initial or authorized)
   */
  register: asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      throw ApiError.conflict('An account with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Prevent random users from registering as ADMIN unless it is the first user on the platform
    let assignedRole = 'STUDENT';
    if (role === 'ADMIN') {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        assignedRole = 'ADMIN';
      } else {
        // Only allow if requested by an authenticated ADMIN
        if (req.user && req.user.role === 'ADMIN') {
          assignedRole = 'ADMIN';
        }
      }
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: assignedRole
    });

    const token = generateToken(user);

    return ApiResponse.created(res, 'User registered successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      token
    });
  }),

  /**
   * Log in user with email & password
   */
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw ApiError.badRequest('Please provide both email and password');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = generateToken(user);

    return ApiResponse.success(res, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      token
    });
  }),

  /**
   * Get current authenticated user
   */
  getMe: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw ApiError.notFound('User profile not found');
    }

    return ApiResponse.success(res, 'User profile retrieved', { user });
  }),

  /**
   * Logout user (stateless JWT acknowledgment)
   */
  logout: asyncHandler(async (req, res) => {
    return ApiResponse.success(res, 'Logged out successfully');
  })
};
