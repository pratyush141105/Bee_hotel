import { Router } from 'express';
import * as banquetController from '../controllers/banquet.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { uploadMultipleImages } from '../middlewares/upload.middleware.js';
import {
  createHallBodySchema,
  updateHallBodySchema,
  idParamsSchema as hallIdSchema,
  hallQuerySchema,
} from '../validators/banquet/hall.validator.js';
import {
  createBookingBodySchema,
  idParamsSchema as bookingIdSchema,
  bookingQuerySchema,
} from '../validators/banquet/booking.validator.js';

const router = Router();

// ─── Hall Routes ────────────────────────────────────────────

router.get('/halls', validate({ query: hallQuerySchema }), banquetController.listHalls);
router.get('/halls/:id', validate({ params: hallIdSchema }), banquetController.getHallById);

router.post(
  '/halls',
  authenticateAdmin,
  uploadMultipleImages('images', 10),
  validate({ body: createHallBodySchema }),
  banquetController.createHall
);
router.put(
  '/halls/:id',
  authenticateAdmin,
  uploadMultipleImages('images', 10),
  validate({ params: hallIdSchema, body: updateHallBodySchema }),
  banquetController.updateHall
);
router.delete(
  '/halls/:id',
  authenticateAdmin,
  validate({ params: hallIdSchema }),
  banquetController.deleteHall
);

// ─── Booking Routes ─────────────────────────────────────────

// Public — anyone can submit a booking inquiry
router.post('/book', validate({ body: createBookingBodySchema }), banquetController.createBooking);

// Protected — admin only
router.get('/bookings', authenticateAdmin, validate({ query: bookingQuerySchema }), banquetController.listBookings);
router.get('/bookings/:id', authenticateAdmin, validate({ params: bookingIdSchema }), banquetController.getBookingById);
router.put('/bookings/:id/approve', authenticateAdmin, validate({ params: bookingIdSchema }), banquetController.approveBooking);
router.put('/bookings/:id/reject', authenticateAdmin, validate({ params: bookingIdSchema }), banquetController.rejectBooking);
router.put('/bookings/:id/complete', authenticateAdmin, validate({ params: bookingIdSchema }), banquetController.completeBooking);
router.delete('/bookings/:id', authenticateAdmin, validate({ params: bookingIdSchema }), banquetController.deleteBooking);

export default router;
