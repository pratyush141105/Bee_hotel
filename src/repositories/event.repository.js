import Event from '../models/event.model.js';

const EventRepository = {
  findAll: (filter = {}, options = {}) =>
    Event.find(filter)
      .sort(options.sort || { date: 1 })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .lean(),

  count: (filter = {}) => Event.countDocuments(filter),

  findById: (id) => Event.findById(id).lean(),

  create: (data) => Event.create(data),

  update: (id, data) =>
    Event.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean(),

  delete: (id) => Event.findByIdAndDelete(id),

  /**
   * Find events with date >= today.
   */
  findUpcoming: (filter = {}, options = {}) =>
    Event.find({ date: { $gte: new Date() }, ...filter })
      .sort({ date: 1 })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .lean(),

  countUpcoming: (filter = {}) =>
    Event.countDocuments({ date: { $gte: new Date() }, ...filter }),

  search: (query, filter = {}, options = {}) =>
    Event.find({ $text: { $search: query }, ...filter }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .lean(),
};

export default EventRepository;
