import { Router } from 'express';
import * as aboutController from '../controllers/about.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updateAboutBodySchema } from '../validators/about/updateAbout.validator.js';

const router = Router();

router.get('/', aboutController.getAbout);
router.put('/', authenticateAdmin, validate({ body: updateAboutBodySchema }), aboutController.updateAbout);

export default router;
