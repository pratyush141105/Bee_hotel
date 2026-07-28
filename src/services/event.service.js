import EventRepository from '../repositories/event.repository.js';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '../utils/cloudinary.util.js';
import { buildQueryOptions, buildPaginationMeta } from '../utils/pagination.util.js';
import AppError from '../errors/AppError.js';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { MESSAGES } from '../constants/messages.constants.js';

const EventService = {
  listEvents: async (queryParams) => {
    const { search, featured, category } = queryParams;
    const options = buildQueryOptions(queryParams);
    const filter = {};
    if (featured !== undefined) filter.featured = featured === 'true';
    if (category) filter.category = category;

    if (search) {
      const items = await EventRepository.search(search, filter, options);
      return { events: items };
    }

    const [events, total] = await Promise.all([
      EventRepository.findAll(filter, options),
      EventRepository.count(filter),
    ]);
    return { events, pagination: buildPaginationMeta(total, options.page, options.limit) };
  },

  getFeaturedEvents: async () => {
    return EventRepository.findAll({ featured: true }, { limit: 10, sort: { date: 1 } });
  },

  getUpcomingEvents: async (queryParams) => {
    const options = buildQueryOptions(queryParams);
    const [events, total] = await Promise.all([
      EventRepository.findUpcoming({}, options),
      EventRepository.countUpcoming({}),
    ]);
    return { events, pagination: buildPaginationMeta(total, options.page, options.limit) };
  },

  getEventById: async (id) => {
    const event = await EventRepository.findById(id);
    if (!event) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return event;
  },

  createEvent: async (data, bannerFile) => {
    if (bannerFile) {
      const { url } = await uploadToCloudinary(bannerFile.buffer, 'hotel_bee/events');
      data.banner = url;
    }
    return EventRepository.create(data);
  },

  updateEvent: async (id, data, bannerFile) => {
    const existing = await EventRepository.findById(id);
    if (!existing) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

    if (bannerFile) {
      if (existing.banner) {
        await deleteFromCloudinary(extractPublicId(existing.banner));
      }
      const { url } = await uploadToCloudinary(bannerFile.buffer, 'hotel_bee/events');
      data.banner = url;
    }

    return EventRepository.update(id, data);
  },

  deleteEvent: async (id) => {
    const existing = await EventRepository.findById(id);
    if (!existing) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

    if (existing.banner) {
      await deleteFromCloudinary(extractPublicId(existing.banner));
    }

    await EventRepository.delete(id);
  },
};

export default EventService;
