import { Router } from 'express';
import * as reviewController from '../controllers/review.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createReviewBodySchema,
  idParamsSchema,
  reviewQuerySchema,
} from '../validators/review/review.validator.js';

const router = Router();

// Public
router.get('/', validate({ query: reviewQuerySchema }), reviewController.listReviews);
router.post('/', validate({ body: createReviewBodySchema }), reviewController.addReview);

// Protected
router.put('/:id/approve', authenticateAdmin, validate({ params: idParamsSchema }), reviewController.approveReview);
router.delete('/:id', authenticateAdmin, validate({ params: idParamsSchema }), reviewController.deleteReview);

export default router;
