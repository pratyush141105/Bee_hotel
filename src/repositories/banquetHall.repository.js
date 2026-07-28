import BanquetHall from '../models/banquetHall.model.js';

const BanquetHallRepository = {
  findAll: (filter = {}, options = {}) =>
    BanquetHall.find(filter)
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .lean(),

  count: (filter = {}) => BanquetHall.countDocuments(filter),

  findById: (id) => BanquetHall.findById(id).lean(),

  create: (data) => BanquetHall.create(data),

  update: (id, data) =>
    BanquetHall.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean(),

  delete: (id) => BanquetHall.findByIdAndDelete(id),
};

export default BanquetHallRepository;
