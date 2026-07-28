import { Router } from 'express';
import * as galleryController from '../controllers/gallery.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { uploadMedia } from '../middlewares/upload.middleware.js';
import {
  uploadGalleryBodySchema,
  updateGalleryBodySchema,
  idParamsSchema,
  galleryQuerySchema,
} from '../validators/gallery/gallery.validator.js';

const router = Router();

router.get('/', validate({ query: galleryQuerySchema }), galleryController.listGallery);

router.post(
  '/',
  authenticateAdmin,
  uploadMedia('media'),
  validate({ body: uploadGalleryBodySchema }),
  galleryController.uploadMedia
);
router.put(
  '/:id',
  authenticateAdmin,
  validate({ params: idParamsSchema, body: updateGalleryBodySchema }),
  galleryController.updateGalleryItem
);
router.delete(
  '/:id',
  authenticateAdmin,
  validate({ params: idParamsSchema }),
  galleryController.deleteGalleryItem
);

export default router;
