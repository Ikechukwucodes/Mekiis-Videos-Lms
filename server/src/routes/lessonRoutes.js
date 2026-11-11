import { Router } from 'express';
import { lessonController } from '../controllers/lessonController.js';
import { progressController } from '../controllers/progressController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateObjectIdParam } from '../middleware/validate.js';

const router = Router();

router.get(
  '/:lessonId',
  authenticate,
  validateObjectIdParam('lessonId'),
  lessonController.getLessonById
);

router.post(
  '/:lessonId/complete',
  authenticate,
  validateObjectIdParam('lessonId'),
  progressController.completeLesson
);

router.patch(
  '/:lessonId',
  authenticate,
  authorize('ADMIN'),
  validateObjectIdParam('lessonId'),
  lessonController.updateLesson
);
router.delete(
  '/:lessonId',
  authenticate,
  authorize('ADMIN'),
  validateObjectIdParam('lessonId'),
  lessonController.deleteLesson
);

export default router;
