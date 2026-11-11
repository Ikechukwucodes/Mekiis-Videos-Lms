import { User } from '../models/User.js';
import { Course } from '../models/Course.js';
import { Enrollment } from '../models/Enrollment.js';
import { Progress } from '../models/Progress.js';

export const statsService = {
  /**
   * Aggregate platform-wide analytics for admin dashboard
   */
  async getAdminStats() {
    const [
      totalUsers,
      totalStudents,
      totalAdmins,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      completedEnrollments,
      recentEnrollments
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'STUDENT' }),
      User.countDocuments({ role: 'ADMIN' }),
      Course.countDocuments(),
      Course.countDocuments({ published: true }),
      Enrollment.countDocuments(),
      Enrollment.countDocuments({ status: 'completed' }),
      Enrollment.find()
        .sort({ enrolledAt: -1 })
        .limit(5)
        .populate('userId', 'name email')
        .populate('courseId', 'title thumbnail')
        .lean()
    ]);

    // Active learners: users who accessed lessons in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeLearners = await Progress.distinct('userId', {
      lastAccessedAt: { $gte: thirtyDaysAgo }
    });

    return {
      totalUsers,
      totalStudents,
      totalAdmins,
      totalCourses,
      publishedCourses,
      draftCourses: totalCourses - publishedCourses,
      totalEnrollments,
      completedEnrollments,
      activeLearnersCount: activeLearners.length,
      recentEnrollments
    };
  },

  /**
   * Aggregate student learning statistics for student dashboard
   */
  async getStudentStats(userId) {
    const enrollments = await Enrollment.find({ userId }).populate('courseId').lean();
    const courseIds = enrollments.map((e) => e.courseId?._id).filter(Boolean);

    const progressRecords = await Progress.find({
      userId,
      courseId: { $in: courseIds }
    }).lean();

    const progressMap = new Map();
    progressRecords.forEach((p) => progressMap.set(p.courseId.toString(), p));

    let completedCoursesCount = 0;
    let inProgressCount = 0;
    let totalPercentageSum = 0;

    enrollments.forEach((e) => {
      const p = progressMap.get(e.courseId?._id?.toString());
      if (p) {
        totalPercentageSum += p.completionPercentage || 0;
        if (p.completed || e.status === 'completed') {
          completedCoursesCount++;
        } else if (p.completionPercentage > 0) {
          inProgressCount++;
        }
      }
    });

    const totalEnrolled = enrollments.length;
    const averageCompletion =
      totalEnrolled > 0 ? Math.round(totalPercentageSum / totalEnrolled) : 0;

    return {
      totalEnrolled,
      completedCoursesCount,
      inProgressCount,
      averageCompletion
    };
  }
};
