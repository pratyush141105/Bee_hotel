import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authLimiter } from '../middlewares/rateLimiter.middleware.js';
import { loginBodySchema } from '../validators/admin/login.validator.js';
import { changePasswordBodySchema } from '../validators/admin/changePassword.validator.js';
import { updateProfileBodySchema } from '../validators/admin/updateProfile.validator.js';

const router = Router();

// Public
router.post('/login', authLimiter, validate({ body: loginBodySchema }), authController.login);

// Protected
router.post('/logout', authenticateAdmin, authController.logout);
router.get('/me', authenticateAdmin, authController.getCurrentAdmin);
router.put(
  '/profile',
  authenticateAdmin,
  validate({ body: updateProfileBodySchema }),
  authController.updateProfile
);
router.put(
  '/change-password',
  authenticateAdmin,
  validate({ body: changePasswordBodySchema }),
  authController.changePassword
);

export default router;
