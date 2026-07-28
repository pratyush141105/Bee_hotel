import Review from '../models/review.model.js';

const ReviewRepository = {
  findAll: (filter = {}, options = {}) =>
    Review.find(filter)
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .lean(),

  count: (filter = {}) => Review.countDocuments(filter),

  findById: (id) => Review.findById(id).lean(),

  create: (data) => Review.create(data),

  approve: (id) =>
    Review.findByIdAndUpdate(id, { approved: true }, { new: true }).lean(),

  delete: (id) => Review.findByIdAndDelete(id),

  search: (query, filter = {}, options = {}) =>
    Review.find({ $text: { $search: query }, ...filter }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .lean(),
};

export default ReviewRepository;
