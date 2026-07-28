import CateringService from '../models/cateringService.model.js';

const CateringServiceRepository = {
  findAll: (filter = {}, options = {}) =>
    CateringService.find(filter)
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .lean(),

  count: (filter = {}) => CateringService.countDocuments(filter),

  findById: (id) => CateringService.findById(id).lean(),

  create: (data) => CateringService.create(data),

  update: (id, data) =>
    CateringService.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean(),

  delete: (id) => CateringService.findByIdAndDelete(id),
};

export default CateringServiceRepository;
