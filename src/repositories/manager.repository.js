import Manager from '../models/manager.model.js';

const ManagerRepository = {
  findAll: (filter = {}, options = {}) =>
    Manager.find(filter)
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .lean(),

  count: (filter = {}) => Manager.countDocuments(filter),

  findById: (id) => Manager.findById(id).lean(),

  create: (data) => Manager.create(data),

  update: (id, data) =>
    Manager.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean(),

  delete: (id) => Manager.findByIdAndDelete(id),
};

export default ManagerRepository;
