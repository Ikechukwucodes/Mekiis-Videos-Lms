import { progressService } from '../services/progressService.js';
import { statsService } from '../services/statsService.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const progressController = {
  getCourseProgress: asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const result = await progressService.getCourseProgress(req.user._id, courseId);
    return ApiResponse.success(res, 'Course progress retrieved', result);
  }),

  completeLesson: asyncHandler(async (req, res) => {
    const { lessonId } = req.params;
    const result = await progressService.completeLesson(req.user._id, lessonId);
    return ApiResponse.success(res, 'Lesson completed and progress updated', result);
  }),

  updateCurrentLesson: asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const lessonId = req.body.lessonId || req.body.currentLessonId;
    if (!lessonId) {
      throw ApiError.badRequest('lessonId is required');
    }

    const progress = await progressService.updateCurrentLesson(req.user._id, courseId, lessonId);
    return ApiResponse.success(res, 'Current lesson updated', { progress });
  }),

  getStudentStats: asyncHandler(async (req, res) => {
    const stats = await statsService.getStudentStats(req.user._id);
    return ApiResponse.success(res, 'Student stats retrieved', { stats });
  }),

  getMyProgress: asyncHandler(async (req, res) => {
    const result = await progressService.getMyProgress(req.user._id);
    return ApiResponse.success(res, 'Learning progress retrieved', result);
  })
};
