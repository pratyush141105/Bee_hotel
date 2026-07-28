import EventRegistrationRepository from '../repositories/eventRegistration.repository.js';
import EventRepository from '../repositories/event.repository.js';
import Event from '../models/event.model.js';
import { generateReferenceNumber } from '../utils/referenceNumber.util.js';
import { buildQueryOptions, buildPaginationMeta } from '../utils/pagination.util.js';
import AppError from '../errors/AppError.js';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { MESSAGES } from '../constants/messages.constants.js';

const EventRegistrationService = {
  /**
   * Public: Register for an event. Checks availability, capacity, and deadline.
   */
  registerForEvent: async (eventId, data) => {
    const event = await EventRepository.findById(eventId);
    if (!event) throw new AppError('Event not found.', HTTP_STATUS.NOT_FOUND);

    if (!event.registrationEnabled) {
      throw new AppError('Registration is not enabled for this event.', HTTP_STATUS.BAD_REQUEST);
    }

    // Check registration deadline
    if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
      throw new AppError('Registration deadline has passed for this event.', HTTP_STATUS.BAD_REQUEST);
    }

    // Check capacity
    if (event.maximumGuests > 0) {
      const newTotal = event.registeredGuests + (data.numberOfGuests || 1);
      if (newTotal > event.maximumGuests) {
        const remaining = event.maximumGuests - event.registeredGuests;
        throw new AppError(
          `Not enough capacity. Only ${remaining} seat(s) remaining.`,
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    // Create registration with reference number
    data.eventId = eventId;
    data.referenceNumber = generateReferenceNumber('EVT');
    const registration = await EventRegistrationRepository.create(data);

    // Increment registeredGuests counter on the event atomically
    await Event.findByIdAndUpdate(eventId, {
      $inc: { registeredGuests: data.numberOfGuests || 1 },
    });

    return registration;
  },

  /**
   * Public: Check available seats for an event.
   */
  checkAvailability: async (eventId) => {
    const event = await EventRepository.findById(eventId);
    if (!event) throw new AppError('Event not found.', HTTP_STATUS.NOT_FOUND);

    const unlimited = !event.maximumGuests || event.maximumGuests === 0;
    const remainingSeats = unlimited ? null : Math.max(0, event.maximumGuests - event.registeredGuests);

    return {
      eventId,
      title: event.title,
      date: event.date,
      registrationEnabled: event.registrationEnabled,
      maximumGuests: event.maximumGuests || null,
      registeredGuests: event.registeredGuests,
      remainingSeats,
      isFull: unlimited ? false : event.registeredGuests >= event.maximumGuests,
      registrationDeadline: event.registrationDeadline || null,
      deadlinePassed: event.registrationDeadline ? new Date() > new Date(event.registrationDeadline) : false,
    };
  },

  // ─── Admin ─────────────────────────────────────────────────

  listRegistrations: async (queryParams) => {
    const { search, status, eventId } = queryParams;
    const options = buildQueryOptions(queryParams);
    const filter = {};
    if (status) filter.status = status;
    if (eventId) filter.eventId = eventId;

    if (search) {
      const items = await EventRegistrationRepository.search(search, filter, options);
      return { registrations: items };
    }

    const [registrations, total] = await Promise.all([
      EventRegistrationRepository.findAll(filter, options),
      EventRegistrationRepository.count(filter),
    ]);
    return { registrations, pagination: buildPaginationMeta(total, options.page, options.limit) };
  },

  getRegistrationById: async (id) => {
    const reg = await EventRegistrationRepository.findById(id);
    if (!reg) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return reg;
  },

  confirmRegistration: async (id) => {
    const reg = await EventRegistrationRepository.findById(id);
    if (!reg) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return EventRegistrationRepository.updateStatus(id, 'Confirmed');
  },

  cancelRegistration: async (id) => {
    const reg = await EventRegistrationRepository.findById(id);
    if (!reg) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

    // Decrement registeredGuests when a registration is cancelled
    if (reg.status !== 'Cancelled') {
      await Event.findByIdAndUpdate(reg.eventId, {
        $inc: { registeredGuests: -(reg.numberOfGuests || 1) },
      });
    }

    return EventRegistrationRepository.updateStatus(id, 'Cancelled');
  },

  deleteRegistration: async (id) => {
    const reg = await EventRegistrationRepository.findById(id);
    if (!reg) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

    // Decrement guest count if not already cancelled
    if (reg.status !== 'Cancelled') {
      await Event.findByIdAndUpdate(reg.eventId, {
        $inc: { registeredGuests: -(reg.numberOfGuests || 1) },
      });
    }

    await EventRegistrationRepository.delete(id);
  },
};

export default EventRegistrationService;
