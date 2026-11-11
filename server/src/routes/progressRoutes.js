import { Router } from 'express';
import { progressController } from '../controllers/progressController.js';
import { authenticate } from '../middleware/auth.js';
import { validateObjectIdParam } from '../middleware/validate.js';

const router = Router();

router.get('/me/progress', authenticate, progressController.getMyProgress);
router.get('/me/stats', authenticate, progressController.getStudentStats);
router.get(
  '/courses/:courseId/progress',
  authenticate,
  validateObjectIdParam('courseId'),
  progressController.getCourseProgress
);
router.patch(
  '/courses/:courseId/progress',
  authenticate,
  validateObjectIdParam('courseId'),
  progressController.updateCurrentLesson
);
router.patch(
  '/courses/:courseId/progress/current',
  authenticate,
  validateObjectIdParam('courseId'),
  progressController.updateCurrentLesson
);

export default router;
