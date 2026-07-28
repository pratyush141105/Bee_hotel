import { Router } from 'express';
import * as homeController from '../controllers/home.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { uploadFields } from '../middlewares/upload.middleware.js';
import { updateHomeBodySchema } from '../validators/home/updateHome.validator.js';

const router = Router();

router.get('/', homeController.getHome);

router.put(
  '/',
  authenticateAdmin,
  uploadFields([{ name: 'heroImages', maxCount: 5 }]),
  validate({ body: updateHomeBodySchema }),
  homeController.updateHome
);

export default router;
