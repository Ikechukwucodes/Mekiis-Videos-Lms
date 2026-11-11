import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

router.post(
  '/register',
  validateBody({
    name: { type: 'string', minLength: 2 },
    email: { type: 'string', email: true },
    password: { type: 'string', minLength: 6 }
  }),
  authController.register
);
router.post(
  '/login',
  validateBody({
    email: { type: 'string', email: true },
    password: { type: 'string', minLength: 1 }
  }),
  authController.login
);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.getMe);

export default router;
