import RestaurantCategory from '../models/restaurantCategory.model.js';

const RestaurantCategoryRepository = {
  findAll: (filter = {}, options = {}) =>
    RestaurantCategory.find(filter)
      .sort(options.sort || { displayOrder: 1 })
      .skip(options.skip || 0)
      .limit(options.limit || 50)
      .lean(),

  count: (filter = {}) => RestaurantCategory.countDocuments(filter),

  findById: (id) => RestaurantCategory.findById(id).lean(),

  findBySlug: (slug) => RestaurantCategory.findOne({ slug }).lean(),

  create: (data) => RestaurantCategory.create(data),

  update: (id, data) =>
    RestaurantCategory.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean(),

  delete: (id) => RestaurantCategory.findByIdAndDelete(id),
};

export default RestaurantCategoryRepository;
