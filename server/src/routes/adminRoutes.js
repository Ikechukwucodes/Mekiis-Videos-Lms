import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { courseController } from '../controllers/courseController.js';
import { enrollmentController } from '../controllers/enrollmentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Protect all admin routes with authentication & ADMIN role authorization
router.use(authenticate, authorize('ADMIN'));

router.get('/analytics', adminController.getAnalytics);
router.get('/courses', courseController.getAdminCourses);
router.get('/users', adminController.getUsers);
router.get('/enrollments', enrollmentController.getAdminEnrollments);
router.get('/users/:userId/courses/:courseId/progress', adminController.getStudentProgress);

export default router;
