import { Router } from 'express';
import { courseController } from '../controllers/courseController.js';
import { moduleController } from '../controllers/moduleController.js';
import { adminController } from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Soft-auth middleware for public course details (to check enrollment if token is present)
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
};

// Public course browsing
router.get('/', courseController.getAllCourses);
router.get('/:id', optionalAuth, courseController.getCourseById);

// Admin course management
router.post('/', authenticate, authorize('ADMIN'), courseController.createCourse);
router.patch('/:id', authenticate, authorize('ADMIN'), courseController.updateCourse);
router.delete('/:id', authenticate, authorize('ADMIN'), courseController.deleteCourse);

// Admin curriculum management under courses
router.post('/:courseId/modules', authenticate, authorize('ADMIN'), moduleController.createModule);
router.patch('/:courseId/reorder', authenticate, authorize('ADMIN'), adminController.reorderCurriculum);

export default router;
