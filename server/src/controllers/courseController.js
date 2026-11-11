import { Course } from '../models/Course.js';
import { Module } from '../models/Module.js';
import { Lesson } from '../models/Lesson.js';
import { Enrollment } from '../models/Enrollment.js';
import { Progress } from '../models/Progress.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { slugify } from '../utils/slugify.js';

export const courseController = {
  /**
   * Get all published courses for public catalog (with optional search, category, and level filters)
   */
  getAllCourses: asyncHandler(async (req, res) => {
    const { search, category, level } = req.query;

    const filter = { published: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (level && level !== 'All') {
      filter.level = level;
    }

    const courses = await Course.find(filter).sort({ createdAt: -1 }).lean();

    // Attach modules/lessons count and total duration
    const courseIds = courses.map((c) => c._id);
    const [modules, lessons] = await Promise.all([
      Module.find({ courseId: { $in: courseIds } }).lean(),
      Lesson.find({ courseId: { $in: courseIds }, published: true }).lean()
    ]);

    const moduleCounts = new Map();
    modules.forEach((m) => {
      const cid = m.courseId.toString();
      moduleCounts.set(cid, (moduleCounts.get(cid) || 0) + 1);
    });

    const lessonCounts = new Map();
    const durationSums = new Map();
    lessons.forEach((l) => {
      const cid = l.courseId.toString();
      lessonCounts.set(cid, (lessonCounts.get(cid) || 0) + 1);
      durationSums.set(cid, (durationSums.get(cid) || 0) + (l.duration || 0));
    });

    const coursesWithStats = courses.map((course) => {
      const cid = course._id.toString();
      return {
        ...course,
        moduleCount: moduleCounts.get(cid) || 0,
        lessonCount: lessonCounts.get(cid) || 0,
        totalDuration: durationSums.get(cid) || 0
      };
    });

    return ApiResponse.success(res, 'Courses retrieved', { courses: coursesWithStats });
  }),

  /**
   * Get course details by ID or Slug with ordered modules and lessons
   */
  getCourseById: asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if queried by ObjectId or by Slug
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };

    const course = await Course.findOne(query).lean();
    if (!course) {
      throw ApiError.notFound('Course not found');
    }

    // If course is not published, only admins can view it
    if (!course.published && (!req.user || req.user.role !== 'ADMIN')) {
      throw ApiError.forbidden('Course is currently not published');
    }

    // Fetch modules and lessons
    const modules = await Module.find({ courseId: course._id }).sort({ order: 1 }).lean();
    const moduleIds = modules.map((m) => m._id);

    // If user is not admin, only fetch published lessons
    const lessonQuery = {
      courseId: course._id,
      moduleId: { $in: moduleIds }
    };
    if (!req.user || req.user.role !== 'ADMIN') {
      lessonQuery.published = true;
    }

    const lessons = await Lesson.find(lessonQuery).sort({ order: 1 }).lean();

    const includeMedia = req.user?.role === 'ADMIN';
    const outlineLessons = lessons.map((l) => {
      if (includeMedia) return l;
      const { videoUrl, embedUrl, ...rest } = l;
      return rest;
    });

    const lessonsByModule = new Map();
    outlineLessons.forEach((l) => {
      const mid = l.moduleId.toString();
      if (!lessonsByModule.has(mid)) lessonsByModule.set(mid, []);
      lessonsByModule.get(mid).push(l);
    });

    const populatedModules = modules.map((m) => ({
      ...m,
      lessons: lessonsByModule.get(m._id.toString()) || []
    }));

    // Check if current user is enrolled
    let isEnrolled = false;
    if (req.user) {
      const enrollment = await Enrollment.findOne({ userId: req.user._id, courseId: course._id });
      isEnrolled = !!enrollment;
    }

    return ApiResponse.success(res, 'Course details retrieved', {
      course: {
        ...course,
        modules: populatedModules,
        isEnrolled,
        totalLessons: lessons.length
      }
    });
  }),

  /**
   * Admin: Create new course
   */
  createCourse: asyncHandler(async (req, res) => {
    const { title, description, thumbnail, category, level, instructor, published } = req.body;

    if (!title || !description || !category) {
      throw ApiError.badRequest('Please provide title, description, and category');
    }

    let baseSlug = slugify(title);
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (await Course.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    const course = await Course.create({
      title: title.trim(),
      slug: uniqueSlug,
      description: description.trim(),
      thumbnail: thumbnail || undefined,
      category: category.trim(),
      level: level || 'Beginner',
      instructor: instructor?.trim() || req.user.name || 'LearnPulse Instructor',
      published: Boolean(published)
    });

    return ApiResponse.created(res, 'Course created successfully', { course });
  }),

  /**
   * Admin: Update course
   */
  updateCourse: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.slug;
    delete updateData.createdAt;

    if (updateData.title) {
      updateData.title = updateData.title.trim();
    }

    const course = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!course) {
      throw ApiError.notFound('Course not found');
    }

    return ApiResponse.success(res, 'Course updated successfully', { course });
  }),

  /**
   * Admin: Delete course with cascade cleanup
   */
  deleteCourse: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      throw ApiError.notFound('Course not found');
    }

    // Cascade delete associated modules, lessons, enrollments, and progress
    await Promise.all([
      Course.findByIdAndDelete(id),
      Module.deleteMany({ courseId: id }),
      Lesson.deleteMany({ courseId: id }),
      Enrollment.deleteMany({ courseId: id }),
      Progress.deleteMany({ courseId: id })
    ]);

    return ApiResponse.success(res, 'Course and all associated curriculum deleted successfully');
  }),

  /**
   * Admin: Get all courses (both published and drafts)
   */
  getAdminCourses: asyncHandler(async (req, res) => {
    const courses = await Course.find().sort({ createdAt: -1 }).lean();

    const courseIds = courses.map((c) => c._id);
    const [enrollmentCounts, moduleCounts, lessonCounts] = await Promise.all([
      Enrollment.aggregate([
        { $match: { courseId: { $in: courseIds } } },
        { $group: { _id: '$courseId', count: { $sum: 1 } } }
      ]),
      Module.aggregate([
        { $match: { courseId: { $in: courseIds } } },
        { $group: { _id: '$courseId', count: { $sum: 1 } } }
      ]),
      Lesson.aggregate([
        { $match: { courseId: { $in: courseIds } } },
        { $group: { _id: '$courseId', count: { $sum: 1 } } }
      ])
    ]);

    const enrollMap = new Map(enrollmentCounts.map((e) => [e._id.toString(), e.count]));
    const modMap = new Map(moduleCounts.map((m) => [m._id.toString(), m.count]));
    const lessonMap = new Map(lessonCounts.map((l) => [l._id.toString(), l.count]));

    const adminCourses = courses.map((course) => {
      const cid = course._id.toString();
      return {
        ...course,
        enrollmentCount: enrollMap.get(cid) || 0,
        moduleCount: modMap.get(cid) || 0,
        lessonCount: lessonMap.get(cid) || 0
      };
    });

    return ApiResponse.success(res, 'Admin courses retrieved', { courses: adminCourses });
  })
};
