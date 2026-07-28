import EventRegistration from '../models/eventRegistration.model.js';

const EventRegistrationRepository = {
  findAll: (filter = {}, options = {}) =>
    EventRegistration.find(filter)
      .populate('eventId', 'title date time category')
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .lean(),

  count: (filter = {}) => EventRegistration.countDocuments(filter),

  findById: (id) =>
    EventRegistration.findById(id).populate('eventId', 'title date time category maximumGuests registeredGuests').lean(),

  findByEventId: (eventId, filter = {}) =>
    EventRegistration.find({ eventId, ...filter }).lean(),

  /**
   * Count total registered guests for an event (only non-cancelled registrations).
   */
  countRegisteredGuests: (eventId) =>
    EventRegistration.aggregate([
      { $match: { eventId: eventId, status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$numberOfGuests' } } },
    ]),

  create: (data) => EventRegistration.create(data),

  updateStatus: (id, status) =>
    EventRegistration.findByIdAndUpdate(id, { status }, { new: true }).lean(),

  delete: (id) => EventRegistration.findByIdAndDelete(id),

  search: (query, filter = {}, options = {}) =>
    EventRegistration.find(
      { $text: { $search: query }, ...filter },
      { score: { $meta: 'textScore' } }
    )
      .populate('eventId', 'title date')
      .sort({ score: { $meta: 'textScore' } })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .lean(),
};

export default EventRegistrationRepository;
