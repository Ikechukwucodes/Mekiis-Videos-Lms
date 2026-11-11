import { Router } from 'express';
import { enrollmentController } from '../controllers/enrollmentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Student enrollment actions
router.post('/courses/:courseId/enroll', authenticate, enrollmentController.enrollInCourse);
router.get('/me/courses', authenticate, enrollmentController.getMyCourses);

// Admin view of all enrollments
router.get('/admin/enrollments', authenticate, authorize('ADMIN'), enrollmentController.getAdminEnrollments);

export default router;
