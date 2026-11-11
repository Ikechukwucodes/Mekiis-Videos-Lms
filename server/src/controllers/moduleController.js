import { Module } from '../models/Module.js';
import { Lesson } from '../models/Lesson.js';
import { Course } from '../models/Course.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const moduleController = {
  /**
   * Admin: Add a module to a course
   */
  createModule: asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { title, description } = req.body;

    if (!title) {
      throw ApiError.badRequest('Module title is required');
    }

    const course = await Course.findById(courseId);
    if (!course) {
      throw ApiError.notFound('Course not found');
    }

    // Determine next order
    const lastModule = await Module.findOne({ courseId }).sort({ order: -1 });
    const nextOrder = lastModule ? lastModule.order + 1 : 0;

    const module = await Module.create({
      courseId,
      title: title.trim(),
      description: description?.trim() || '',
      order: nextOrder
    });

    return ApiResponse.created(res, 'Module created successfully', { module });
  }),

  /**
   * Admin: Update module details
   */
  updateModule: asyncHandler(async (req, res) => {
    const { moduleId } = req.params;
    const { title, description, order } = req.body;

    const module = await Module.findById(moduleId);
    if (!module) {
      throw ApiError.notFound('Module not found');
    }

    if (title !== undefined) module.title = title.trim();
    if (description !== undefined) module.description = description.trim();
    if (order !== undefined) module.order = Number(order);

    await module.save();

    return ApiResponse.success(res, 'Module updated successfully', { module });
  }),

  /**
   * Admin: Delete module and associated lessons
   */
  deleteModule: asyncHandler(async (req, res) => {
    const { moduleId } = req.params;

    const module = await Module.findById(moduleId);
    if (!module) {
      throw ApiError.notFound('Module not found');
    }

    await Promise.all([
      Module.findByIdAndDelete(moduleId),
      Lesson.deleteMany({ moduleId })
    ]);

    return ApiResponse.success(res, 'Module and associated lessons deleted successfully');
  })
};
