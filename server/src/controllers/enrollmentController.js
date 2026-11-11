import { Enrollment } from '../models/Enrollment.js';
import { Course } from '../models/Course.js';
import { Progress } from '../models/Progress.js';
import { Lesson } from '../models/Lesson.js';
import { Module } from '../models/Module.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { progressService } from '../services/progressService.js';

export const enrollmentController = {
  /**
   * Enroll authenticated student in a published course
   */
  enrollInCourse: asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      throw ApiError.notFound('Course not found');
    }

    if (!course.published && req.user.role !== 'ADMIN') {
      throw ApiError.forbidden('Cannot enroll in an unpublished course');
    }

    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      throw ApiError.conflict('You are already enrolled in this course');
    }

    const enrollment = await Enrollment.create({
      userId,
      courseId,
      enrolledAt: new Date(),
      status: 'active'
    });

    // Initialize progress record for this course
    const orderedLessons = await progressService.getOrderedLessons(courseId);
    const firstLessonId = orderedLessons.length > 0 ? orderedLessons[0]._id : null;

    const progress = await Progress.create({
      userId,
      courseId,
      currentLessonId: firstLessonId,
      lastAccessedLessonId: firstLessonId,
      completedLessons: [],
      completionPercentage: 0,
      completed: false,
      lastAccessedAt: new Date()
    });

    return ApiResponse.created(res, 'Successfully enrolled in course', {
      enrollment,
      progress
    });
  }),

  /**
   * Get enrolled courses for the logged-in student with progress summaries
   */
  getMyCourses: asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const enrollments = await Enrollment.find({ userId })
      .populate('courseId')
      .sort({ enrolledAt: -1 })
      .lean();

    const courseIds = enrollments.map((e) => e.courseId?._id).filter(Boolean);

    // Fetch progress and lesson counts for all enrolled courses
    const [progressRecords, lessons] = await Promise.all([
      Progress.find({ userId, courseId: { $in: courseIds } })
        .populate('currentLessonId', 'title order duration')
        .lean(),
      Lesson.find({ courseId: { $in: courseIds }, published: true }).lean()
    ]);

    const progressMap = new Map();
    progressRecords.forEach((p) => progressMap.set(p.courseId.toString(), p));

    const lessonCountMap = new Map();
    lessons.forEach((l) => {
      const cid = l.courseId.toString();
      lessonCountMap.set(cid, (lessonCountMap.get(cid) || 0) + 1);
    });

    const enrolledCourses = enrollments
      .filter((e) => e.courseId) // Filter out any deleted courses
      .map((enrollment) => {
        const course = enrollment.courseId;
        const cid = course._id.toString();
        const progress = progressMap.get(cid) || {
          completionPercentage: 0,
          completed: false,
          completedLessons: []
        };

        return {
          enrollmentId: enrollment._id,
          enrolledAt: enrollment.enrolledAt,
          status: enrollment.status,
          course: {
            ...course,
            totalLessons: lessonCountMap.get(cid) || 0
          },
          progress: {
            completionPercentage: progress.completionPercentage || 0,
            completed: progress.completed || false,
            completedCount: progress.completedLessons ? progress.completedLessons.length : 0,
            currentLesson: progress.currentLessonId || null,
            lastAccessedAt: progress.lastAccessedAt
          }
        };
      });

    return ApiResponse.success(res, 'Enrolled courses retrieved', { courses: enrolledCourses });
  }),

  /**
   * Admin: View all platform enrollments
   */
  getAdminEnrollments: asyncHandler(async (req, res) => {
    const enrollments = await Enrollment.find()
      .populate('userId', 'name email role')
      .populate('courseId', 'title category thumbnail')
      .sort({ enrolledAt: -1 })
      .lean();

    const progressRecords = await Progress.find().select('userId courseId completionPercentage completed currentLessonId lastAccessedAt').lean();
    const progressMap = new Map(
      progressRecords.map((p) => [`${p.userId.toString()}:${p.courseId.toString()}`, p])
    );

    const withProgress = enrollments.map((enrollment) => {
      const key = `${enrollment.userId?._id?.toString()}:${enrollment.courseId?._id?.toString()}`;
      return {
        ...enrollment,
        progress: progressMap.get(key) || null
      };
    });

    return ApiResponse.success(res, 'Enrollments retrieved', { enrollments: withProgress });
  })
};
