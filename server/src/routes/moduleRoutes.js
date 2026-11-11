import { Router } from 'express';
import { moduleController } from '../controllers/moduleController.js';
import { lessonController } from '../controllers/lessonController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Admin module updates & deletion
router.patch('/:moduleId', authenticate, authorize('ADMIN'), moduleController.updateModule);
router.delete('/:moduleId', authenticate, authorize('ADMIN'), moduleController.deleteModule);

// Admin lesson creation under module
router.post('/:moduleId/lessons', authenticate, authorize('ADMIN'), lessonController.createLesson);

export default router;
