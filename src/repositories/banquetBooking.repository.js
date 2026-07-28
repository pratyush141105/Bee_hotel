import BanquetBooking from '../models/banquetBooking.model.js';

const BanquetBookingRepository = {
  findAll: (filter = {}, options = {}) =>
    BanquetBooking.find(filter)
      .populate('hall', 'name capacity')
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .lean(),

  count: (filter = {}) => BanquetBooking.countDocuments(filter),

  findById: (id) => BanquetBooking.findById(id).populate('hall', 'name capacity pricePerDay').lean(),

  create: (data) => BanquetBooking.create(data),

  updateStatus: (id, status) =>
    BanquetBooking.findByIdAndUpdate(id, { status }, { new: true }).lean(),

  delete: (id) => BanquetBooking.findByIdAndDelete(id),
};

export default BanquetBookingRepository;
