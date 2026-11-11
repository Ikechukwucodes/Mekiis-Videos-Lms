import { Progress } from '../models/Progress.js';
import { Enrollment } from '../models/Enrollment.js';
import { Lesson } from '../models/Lesson.js';
import { Module } from '../models/Module.js';
import { ApiError } from '../utils/apiError.js';

export const progressService = {
  async getOrderedLessons(courseId) {
    const modules = await Module.find({ courseId }).sort({ order: 1 }).lean();
    const moduleIds = modules.map((m) => m._id);

    const lessons = await Lesson.find({
      courseId,
      moduleId: { $in: moduleIds },
      published: true
    })
      .sort({ order: 1 })
      .lean();

    const moduleOrderMap = new Map();
    modules.forEach((mod, idx) => moduleOrderMap.set(mod._id.toString(), idx));

    return lessons.sort((a, b) => {
      const modAOrder = moduleOrderMap.get(a.moduleId.toString()) ?? 0;
      const modBOrder = moduleOrderMap.get(b.moduleId.toString()) ?? 0;
      if (modAOrder !== modBOrder) return modAOrder - modBOrder;
      return a.order - b.order;
    });
  },

  async recalculate(progress, courseId) {
    const orderedLessons = await this.getOrderedLessons(courseId);
    const totalLessons = orderedLessons.length;
    const completedSet = new Set(progress.completedLessons.map((id) => id.toString()));
    const completionPercentage =
      totalLessons > 0 ? Math.min(100, Math.round((completedSet.size / totalLessons) * 100)) : 0;
    const isCourseCompleted = totalLessons > 0 && completedSet.size >= totalLessons;
    const nextLesson = orderedLessons.find((l) => !completedSet.has(l._id.toString()));

    progress.completionPercentage = completionPercentage;
    progress.completed = isCourseCompleted;
    progress.currentLessonId = nextLesson ? nextLesson._id : progress.lastAccessedLessonId;
    return { orderedLessons, totalLessons, nextLesson, completionPercentage, isCourseCompleted };
  },

  async getCourseProgress(userId, courseId) {
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      throw ApiError.forbidden('You are not enrolled in this course');
    }

    const orderedLessons = await this.getOrderedLessons(courseId);
    const totalLessons = orderedLessons.length;
    const firstLessonId = orderedLessons.length > 0 ? orderedLessons[0]._id : null;

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = await Progress.create({
        userId,
        courseId,
        currentLessonId: firstLessonId,
        lastAccessedLessonId: firstLessonId,
        completedLessons: [],
        completionPercentage: 0,
        completed: false,
        lastAccessedAt: new Date()
      });
    }

    return {
      progress,
      totalLessons,
      completedCount: progress.completedLessons.length,
      currentLessonId: progress.currentLessonId,
      lastAccessedLessonId: progress.lastAccessedLessonId
    };
  },

  async getMyProgress(userId) {
    const [enrollments, records] = await Promise.all([
      Enrollment.find({ userId }).lean(),
      Progress.find({ userId }).populate('currentLessonId', 'title').populate('lastAccessedLessonId', 'title').lean()
    ]);

    return {
      enrollments,
      progress: records
    };
  },

  async completeLesson(userId, lessonId) {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      throw ApiError.notFound('Lesson not found');
    }

    const courseId = lesson.courseId;
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      throw ApiError.forbidden('You must be enrolled in the course to complete lessons');
    }

    let progress = await Progress.findOneAndUpdate(
      { userId, courseId },
      {
        $addToSet: { completedLessons: lesson._id },
        $set: {
          lastAccessedLessonId: lesson._id,
          lastAccessedAt: new Date()
        }
      },
      { new: true, upsert: true }
    );

    const { totalLessons, nextLesson, completionPercentage, isCourseCompleted } = await this.recalculate(
      progress,
      courseId
    );

    progress.lastAccessedLessonId = lesson._id;
    progress.lastAccessedAt = new Date();
    await progress.save();

    if (isCourseCompleted && enrollment.status !== 'completed') {
      enrollment.status = 'completed';
      await enrollment.save();
    }

    return {
      progress,
      nextLessonId: nextLesson ? nextLesson._id : null,
      totalLessons,
      completionPercentage,
      completed: isCourseCompleted
    };
  },

  async updateCurrentLesson(userId, courseId, lessonId) {
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      throw ApiError.forbidden('You are not enrolled in this course');
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson || lesson.courseId.toString() !== courseId.toString()) {
      throw ApiError.badRequest('Lesson does not belong to this course');
    }

    const progress = await Progress.findOneAndUpdate(
      { userId, courseId },
      {
        $set: {
          currentLessonId: lessonId,
          lastAccessedLessonId: lessonId,
          lastAccessedAt: new Date()
        }
      },
      { new: true, upsert: true }
    );

    return progress;
  }
};
