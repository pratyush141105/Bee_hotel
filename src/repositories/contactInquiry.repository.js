import ContactInquiry from '../models/contactInquiry.model.js';

const ContactInquiryRepository = {
  findAll: (filter = {}, options = {}) =>
    ContactInquiry.find(filter)
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .lean(),

  count: (filter = {}) => ContactInquiry.countDocuments(filter),

  findById: (id) => ContactInquiry.findById(id).lean(),

  create: (data) => ContactInquiry.create(data),

  updateStatus: (id, status) =>
    ContactInquiry.findByIdAndUpdate(id, { status }, { new: true }).lean(),

  delete: (id) => ContactInquiry.findByIdAndDelete(id),

  search: (query, filter = {}, options = {}) =>
    ContactInquiry.find(
      { $text: { $search: query }, ...filter },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .lean(),

  searchCount: (query, filter = {}) =>
    ContactInquiry.countDocuments({ $text: { $search: query }, ...filter }),
};

export default ContactInquiryRepository;
