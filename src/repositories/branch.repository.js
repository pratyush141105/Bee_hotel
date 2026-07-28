import Branch from '../models/branch.model.js';

const BranchRepository = {
  findAll: (filter = {}, options = {}) =>
    Branch.find(filter)
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .lean(),

  count: (filter = {}) => Branch.countDocuments(filter),

  findById: (id) => Branch.findById(id).lean(),

  create: (data) => Branch.create(data),

  update: (id, data) =>
    Branch.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean(),

  delete: (id) => Branch.findByIdAndDelete(id),
};

export default BranchRepository;
