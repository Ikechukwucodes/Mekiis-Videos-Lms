import { Lesson } from '../models/Lesson.js';
import { Module } from '../models/Module.js';
import { Course } from '../models/Course.js';
import { Enrollment } from '../models/Enrollment.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseVideoUrl } from '../utils/videoHelper.js';

export const lessonController = {
  /**
   * Get single lesson content (checks authorization / enrollment)
   */
  getLessonById: asyncHandler(async (req, res) => {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId).lean();
    if (!lesson) {
      throw ApiError.notFound('Lesson not found');
    }

    // Check permissions: Admin can view anytime; Students must be enrolled
    if (!req.user || req.user.role !== 'ADMIN') {
      if (!req.user) {
        throw ApiError.unauthorized('Please log in to access this lesson');
      }

      const enrollment = await Enrollment.findOne({
        userId: req.user._id,
        courseId: lesson.courseId
      });

      if (!enrollment) {
        throw ApiError.forbidden('You must be enrolled in this course to access this lesson');
      }

      if (!lesson.published) {
        throw ApiError.forbidden('This lesson is not currently published');
      }
    }

    // Safely parse video information
    const videoData = parseVideoUrl(lesson.videoUrl || lesson.embedUrl);

    return ApiResponse.success(res, 'Lesson retrieved', {
      lesson: {
        ...lesson,
        videoData
      }
    });
  }),

  /**
   * Admin: Create a new lesson under a module
   */
  createLesson: asyncHandler(async (req, res) => {
    const { moduleId } = req.params;
    const { title, description, contentType, videoUrl, embedUrl, duration, published } = req.body;

    if (!title) {
      throw ApiError.badRequest('Lesson title is required');
    }

    const module = await Module.findById(moduleId);
    if (!module) {
      throw ApiError.notFound('Module not found');
    }

    // Calculate order
    const lastLesson = await Lesson.findOne({ moduleId }).sort({ order: -1 });
    const nextOrder = lastLesson ? lastLesson.order + 1 : 0;

    let processedEmbedUrl = embedUrl || '';
    if (videoUrl) {
      const parsed = parseVideoUrl(videoUrl);
      if (!parsed.isValid) {
        throw ApiError.badRequest(parsed.error || 'Invalid video URL');
      }
      if (parsed.embedUrl) {
        processedEmbedUrl = parsed.embedUrl;
      }
    }

    const lesson = await Lesson.create({
      courseId: module.courseId,
      moduleId,
      title: title.trim(),
      description: description?.trim() || '',
      contentType: contentType || 'video',
      videoUrl: videoUrl?.trim() || '',
      embedUrl: processedEmbedUrl,
      duration: Number(duration) || 0,
      order: nextOrder,
      published: published !== undefined ? Boolean(published) : true
    });

    return ApiResponse.created(res, 'Lesson created successfully', { lesson });
  }),

  /**
   * Admin: Update lesson details and video configuration
   */
  updateLesson: asyncHandler(async (req, res) => {
    const { lessonId } = req.params;
    const updateData = { ...req.body };

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      throw ApiError.notFound('Lesson not found');
    }

    if (updateData.title) lesson.title = updateData.title.trim();
    if (updateData.description !== undefined) lesson.description = updateData.description.trim();
    if (updateData.contentType) lesson.contentType = updateData.contentType;
    if (updateData.duration !== undefined) lesson.duration = Number(updateData.duration);
    if (updateData.order !== undefined) lesson.order = Number(updateData.order);
    if (updateData.published !== undefined) lesson.published = Boolean(updateData.published);

    if (updateData.videoUrl !== undefined) {
      lesson.videoUrl = updateData.videoUrl.trim();
      if (lesson.videoUrl) {
        const parsed = parseVideoUrl(lesson.videoUrl);
        if (!parsed.isValid) {
          throw ApiError.badRequest(parsed.error || 'Invalid video URL');
        }
        if (parsed.embedUrl) {
          lesson.embedUrl = parsed.embedUrl;
        } else {
          lesson.embedUrl = '';
        }
      }
    }

    if (updateData.embedUrl !== undefined && !updateData.videoUrl) {
      const parsed = parseVideoUrl(updateData.embedUrl.trim());
      if (updateData.embedUrl.trim() && !parsed.isValid) {
        throw ApiError.badRequest(parsed.error || 'Invalid embed URL');
      }
      lesson.embedUrl = parsed.embedUrl || '';
    }

    await lesson.save();

    return ApiResponse.success(res, 'Lesson updated successfully', { lesson });
  }),

  /**
   * Admin: Delete lesson
   */
  deleteLesson: asyncHandler(async (req, res) => {
    const { lessonId } = req.params;

    const lesson = await Lesson.findByIdAndDelete(lessonId);
    if (!lesson) {
      throw ApiError.notFound('Lesson not found');
    }

    return ApiResponse.success(res, 'Lesson deleted successfully');
  })
};
