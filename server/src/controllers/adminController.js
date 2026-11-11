import { User } from '../models/User.js';
import { Module } from '../models/Module.js';
import { Lesson } from '../models/Lesson.js';
import { Enrollment } from '../models/Enrollment.js';
import { Progress } from '../models/Progress.js';
import { statsService } from '../services/statsService.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const adminController = {
  /**
   * Get overall platform metrics and analytics
   */
  getAnalytics: asyncHandler(async (req, res) => {
    const stats = await statsService.getAdminStats();
    return ApiResponse.success(res, 'Analytics retrieved', { stats });
  }),

  /**
   * Get all registered users and their enrollment summary
   */
  getUsers: asyncHandler(async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    const userIds = users.map((u) => u._id);

    const enrollmentCounts = await Enrollment.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } }
    ]);

    const countMap = new Map(enrollmentCounts.map((e) => [e._id.toString(), e.count]));

    const usersWithStats = users.map((u) => ({
      ...u,
      enrollmentCount: countMap.get(u._id.toString()) || 0
    }));

    return ApiResponse.success(res, 'Users retrieved', { users: usersWithStats });
  }),

  /**
   * Reorder modules and lessons within a course in batch
   */
  reorderCurriculum: asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { modules, lessons } = req.body;

    const updates = [];

    if (Array.isArray(modules)) {
      modules.forEach(({ id, order }) => {
        updates.push(
          Module.updateOne({ _id: id, courseId }, { $set: { order: Number(order) } })
        );
      });
    }

    if (Array.isArray(lessons)) {
      lessons.forEach(({ id, moduleId, order }) => {
        const setFields = { order: Number(order) };
        if (moduleId) setFields.moduleId = moduleId;
        updates.push(
          Lesson.updateOne({ _id: id, courseId }, { $set: setFields })
        );
      });
    }

    await Promise.all(updates);

    return ApiResponse.success(res, 'Curriculum order updated successfully');
  }),

  /**
   * Admin view of a specific student's progress in a course
   */
  getStudentProgress: asyncHandler(async (req, res) => {
    const { userId, courseId } = req.params;

    const [user, progress, enrollment] = await Promise.all([
      User.findById(userId).lean(),
      Progress.findOne({ userId, courseId }).populate('completedLessons', 'title order').lean(),
      Enrollment.findOne({ userId, courseId }).lean()
    ]);

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return ApiResponse.success(res, 'Student progress retrieved', {
      user,
      enrollment,
      progress
    });
  })
};
