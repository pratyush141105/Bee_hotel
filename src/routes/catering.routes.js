import { Router } from 'express';
import * as cateringController from '../controllers/catering.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { uploadMultipleImages } from '../middlewares/upload.middleware.js';
import {
  createCateringBodySchema,
  updateCateringBodySchema,
  idParamsSchema,
  listQuerySchema,
} from '../validators/catering/catering.validator.js';
import {
  createCateringInquiryBodySchema,
  inquiryIdParamsSchema,
  inquiryQuerySchema,
} from '../validators/catering/cateringInquiry.validator.js';

const router = Router();

// ─── Catering Packages (Services) — Public read ──────────────

router.get('/packages', validate({ query: listQuerySchema }), cateringController.listServices);
router.get('/packages/:id', validate({ params: idParamsSchema }), cateringController.getServiceById);

// ─── Catering Packages — Admin ───────────────────────────────

router.post(
  '/packages',
  authenticateAdmin,
  uploadMultipleImages('images', 5),
  validate({ body: createCateringBodySchema }),
  cateringController.createService
);
router.put(
  '/packages/:id',
  authenticateAdmin,
  uploadMultipleImages('images', 5),
  validate({ params: idParamsSchema, body: updateCateringBodySchema }),
  cateringController.updateService
);
router.delete(
  '/packages/:id',
  authenticateAdmin,
  validate({ params: idParamsSchema }),
  cateringController.deleteService
);

// ─── Catering Inquiries — Public ────────────────────────────

router.post(
  '/inquiry',
  validate({ body: createCateringInquiryBodySchema }),
  cateringController.createInquiry
);

// ─── Catering Inquiries — Admin ──────────────────────────────

router.get(
  '/inquiries',
  authenticateAdmin,
  validate({ query: inquiryQuerySchema }),
  cateringController.listInquiries
);
router.get(
  '/inquiries/:id',
  authenticateAdmin,
  validate({ params: inquiryIdParamsSchema }),
  cateringController.getInquiryById
);
router.put(
  '/inquiries/:id/confirm',
  authenticateAdmin,
  validate({ params: inquiryIdParamsSchema }),
  cateringController.confirmInquiry
);
router.put(
  '/inquiries/:id/reject',
  authenticateAdmin,
  validate({ params: inquiryIdParamsSchema }),
  cateringController.rejectInquiry
);
router.put(
  '/inquiries/:id/complete',
  authenticateAdmin,
  validate({ params: inquiryIdParamsSchema }),
  cateringController.completeInquiry
);
router.delete(
  '/inquiries/:id',
  authenticateAdmin,
  validate({ params: inquiryIdParamsSchema }),
  cateringController.deleteInquiry
);

export default router;
