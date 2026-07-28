import CateringInquiry from '../models/cateringInquiry.model.js';

const CateringInquiryRepository = {
  findAll: (filter = {}, options = {}) =>
    CateringInquiry.find(filter)
      .populate('selectedPackage', 'name price')
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .lean(),

  count: (filter = {}) => CateringInquiry.countDocuments(filter),

  findById: (id) =>
    CateringInquiry.findById(id).populate('selectedPackage', 'name price description').lean(),

  create: (data) => CateringInquiry.create(data),

  updateStatus: (id, status) =>
    CateringInquiry.findByIdAndUpdate(id, { status }, { new: true }).lean(),

  delete: (id) => CateringInquiry.findByIdAndDelete(id),

  search: (query, filter = {}, options = {}) =>
    CateringInquiry.find(
      { $text: { $search: query }, ...filter },
      { score: { $meta: 'textScore' } }
    )
      .populate('selectedPackage', 'name price')
      .sort({ score: { $meta: 'textScore' } })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .lean(),

  searchCount: (query, filter = {}) =>
    CateringInquiry.countDocuments({ $text: { $search: query }, ...filter }),
};

export default CateringInquiryRepository;
