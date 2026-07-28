import MenuItem from '../models/menuItem.model.js';

const MenuItemRepository = {
  findAll: (filter = {}, options = {}) =>
    MenuItem.find(filter)
      .populate('categoryId', 'name slug')
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .lean(),

  count: (filter = {}) => MenuItem.countDocuments(filter),

  findById: (id) => MenuItem.findById(id).populate('categoryId', 'name slug').lean(),

  create: (data) => MenuItem.create(data),

  update: (id, data) =>
    MenuItem.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean(),

  delete: (id) => MenuItem.findByIdAndDelete(id),

  /**
   * Full-text search on name + description fields.
   */
  search: (query, options = {}) =>
    MenuItem.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
      .populate('categoryId', 'name slug')
      .sort({ score: { $meta: 'textScore' } })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .lean(),

  searchCount: (query) =>
    MenuItem.countDocuments({ $text: { $search: query } }),
};

export default MenuItemRepository;
