import { Router } from 'express';
import * as eventController from '../controllers/event.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { uploadSingleImage } from '../middlewares/upload.middleware.js';
import {
  createEventBodySchema,
  updateEventBodySchema,
  idParamsSchema,
  eventQuerySchema,
} from '../validators/event/event.validator.js';
import {
  createRegistrationBodySchema,
  eventIdParamsSchema,
  registrationIdParamsSchema,
  registrationQuerySchema,
} from '../validators/event/eventRegistration.validator.js';

const router = Router();

// ─── Public Event Routes ─────────────────────────────────────

// NOTE: named routes declared before /:id to prevent Express conflicts
router.get('/', validate({ query: eventQuerySchema }), eventController.listEvents);
router.get('/featured', eventController.getFeaturedEvents);
router.get('/upcoming', eventController.getUpcomingEvents);

// Admin: registrations list (declared before /:id for routing priority)
router.get(
  '/registrations',
  authenticateAdmin,
  validate({ query: registrationQuerySchema }),
  eventController.listRegistrations
);
router.get(
  '/registrations/:id',
  authenticateAdmin,
  validate({ params: registrationIdParamsSchema }),
  eventController.getRegistrationById
);
router.put(
  '/registrations/:id/confirm',
  authenticateAdmin,
  validate({ params: registrationIdParamsSchema }),
  eventController.confirmRegistration
);
router.put(
  '/registrations/:id/cancel',
  authenticateAdmin,
  validate({ params: registrationIdParamsSchema }),
  eventController.cancelRegistration
);
router.delete(
  '/registrations/:id',
  authenticateAdmin,
  validate({ params: registrationIdParamsSchema }),
  eventController.deleteRegistration
);

// Single event and its registration actions
router.get('/:id', validate({ params: idParamsSchema }), eventController.getEventById);
router.get(
  '/:id/availability',
  validate({ params: eventIdParamsSchema }),
  eventController.checkEventAvailability
);
router.post(
  '/:id/register',
  validate({ params: eventIdParamsSchema, body: createRegistrationBodySchema }),
  eventController.registerForEvent
);

// ─── Protected Event CRUD ────────────────────────────────────

router.post(
  '/',
  authenticateAdmin,
  uploadSingleImage('banner'),
  validate({ body: createEventBodySchema }),
  eventController.createEvent
);
router.put(
  '/:id',
  authenticateAdmin,
  uploadSingleImage('banner'),
  validate({ params: idParamsSchema, body: updateEventBodySchema }),
  eventController.updateEvent
);
router.delete(
  '/:id',
  authenticateAdmin,
  validate({ params: idParamsSchema }),
  eventController.deleteEvent
);

export default router;
