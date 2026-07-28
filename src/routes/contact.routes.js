import { Router } from 'express';
import * as contactController from '../controllers/contact.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updateContactBodySchema } from '../validators/contact/contact.validator.js';
import {
  createContactInquiryBodySchema,
  inquiryIdParamsSchema,
  contactInquiryQuerySchema,
} from '../validators/contact/contactInquiry.validator.js';

const router = Router();

// ─── Contact Info (singleton) — Public read ──────────────────

router.get('/', contactController.getContact);
router.put('/', authenticateAdmin, validate({ body: updateContactBodySchema }), contactController.updateContact);

// ─── Contact Inquiries — Public ──────────────────────────────

router.post(
  '/inquiry',
  validate({ body: createContactInquiryBodySchema }),
  contactController.createContactInquiry
);

// ─── Contact Inquiries — Admin ───────────────────────────────

router.get(
  '/inquiries',
  authenticateAdmin,
  validate({ query: contactInquiryQuerySchema }),
  contactController.listContactInquiries
);
router.get(
  '/inquiries/:id',
  authenticateAdmin,
  validate({ params: inquiryIdParamsSchema }),
  contactController.getContactInquiryById
);
router.put(
  '/inquiries/:id/read',
  authenticateAdmin,
  validate({ params: inquiryIdParamsSchema }),
  contactController.markInquiryAsRead
);
router.put(
  '/inquiries/:id/close',
  authenticateAdmin,
  validate({ params: inquiryIdParamsSchema }),
  contactController.closeContactInquiry
);
router.delete(
  '/inquiries/:id',
  authenticateAdmin,
  validate({ params: inquiryIdParamsSchema }),
  contactController.deleteContactInquiry
);

export default router;
