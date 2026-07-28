import BanquetBookingRepository from '../repositories/banquetBooking.repository.js';
import BanquetHallRepository from '../repositories/banquetHall.repository.js';
import BanquetBooking from '../models/banquetBooking.model.js';
import { generateReferenceNumber } from '../utils/referenceNumber.util.js';
import { buildQueryOptions, buildPaginationMeta } from '../utils/pagination.util.js';
import { BOOKING_STATUS } from '../constants/booking.constants.js';
import AppError from '../errors/AppError.js';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { MESSAGES } from '../constants/messages.constants.js';

/**
 * Checks if a hall is already confirmed-booked for the given date.
 * Only CONFIRMED bookings block availability. Pending bookings do not.
 *
 * @param {string} hallId - BanquetHall ObjectId
 * @param {string|Date} date - The requested event date
 * @param {string} [excludeBookingId] - Optionally exclude a specific booking (for updates)
 * @returns {Promise<boolean>} true if the hall is available
 */
const checkHallAvailability = async (hallId, date, excludeBookingId = null) => {
  const requestedDate = new Date(date);
  const startOfDay = new Date(requestedDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(requestedDate.setHours(23, 59, 59, 999));

  const query = {
    hall: hallId,
    status: BOOKING_STATUS.CONFIRMED,
    date: { $gte: startOfDay, $lte: endOfDay },
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBooking = await BanquetBooking.findOne(query).lean();
  return conflictingBooking === null; // true = available
};

const BanquetBookingService = {
  createBooking: async (data) => {
    // Verify the hall exists and is active
    const hall = await BanquetHallRepository.findById(data.hall);
    if (!hall) throw new AppError('Selected hall not found.', HTTP_STATUS.NOT_FOUND);
    if (hall.status !== 'Active') {
      throw new AppError('This hall is currently not available for booking.', HTTP_STATUS.BAD_REQUEST);
    }

    // Assign a unique reference number
    data.referenceNumber = generateReferenceNumber('BNQ');

    return BanquetBookingRepository.create(data);
  },

  listBookings: async (queryParams) => {
    const options = buildQueryOptions(queryParams);
    const filter = {};
    if (queryParams.status) filter.status = queryParams.status;
    if (queryParams.hall) filter.hall = queryParams.hall;
    if (queryParams.date) {
      const start = new Date(queryParams.date);
      const end = new Date(queryParams.date);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    const [bookings, total] = await Promise.all([
      BanquetBookingRepository.findAll(filter, options),
      BanquetBookingRepository.count(filter),
    ]);
    return { bookings, pagination: buildPaginationMeta(total, options.page, options.limit) };
  },

  getBookingById: async (id) => {
    const booking = await BanquetBookingRepository.findById(id);
    if (!booking) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return booking;
  },

  /**
   * Approves a booking after checking for hall date conflicts.
   * Only CONFIRMED bookings block the hall — Pending bookings do not.
   */
  approveBooking: async (id) => {
    const booking = await BanquetBookingRepository.findById(id);
    if (!booking) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

    const isAvailable = await checkHallAvailability(booking.hall, booking.date, id);
    if (!isAvailable) {
      throw new AppError(
        'Hall is already booked for the selected date. Cannot confirm this booking.',
        HTTP_STATUS.CONFLICT
      );
    }

    return BanquetBookingRepository.updateStatus(id, BOOKING_STATUS.CONFIRMED);
  },

  rejectBooking: async (id) => {
    const booking = await BanquetBookingRepository.findById(id);
    if (!booking) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return BanquetBookingRepository.updateStatus(id, BOOKING_STATUS.REJECTED);
  },

  completeBooking: async (id) => {
    const booking = await BanquetBookingRepository.findById(id);
    if (!booking) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return BanquetBookingRepository.updateStatus(id, BOOKING_STATUS.COMPLETED);
  },

  deleteBooking: async (id) => {
    const booking = await BanquetBookingRepository.findById(id);
    if (!booking) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    await BanquetBookingRepository.delete(id);
  },

  /**
   * Public reusable utility — exposed for potential use in other services.
   */
  checkHallAvailability,
};

export default BanquetBookingService;
