import { Router } from 'express';
import * as settingsController from '../controllers/settings.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { uploadSingleImage } from '../middlewares/upload.middleware.js';
import { updateSettingsBodySchema } from '../validators/settings/settings.validator.js';

const router = Router();

router.use(authenticateAdmin); // All settings routes are protected

router.get('/', settingsController.getSettings);
router.put('/', validate({ body: updateSettingsBodySchema }), settingsController.updateSettings);
router.put('/logo', uploadSingleImage('logo'), settingsController.updateLogo);
router.put('/qr', uploadSingleImage('qr'), settingsController.updateQR);

export default router;
