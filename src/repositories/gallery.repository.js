import Gallery from '../models/gallery.model.js';

const GalleryRepository = {
  findAll: (filter = {}, options = {}) =>
    Gallery.find(filter)
      .sort(options.sort || { displayOrder: 1, createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .lean(),

  count: (filter = {}) => Gallery.countDocuments(filter),

  findById: (id) => Gallery.findById(id).lean(),

  create: (data) => Gallery.create(data),

  update: (id, data) =>
    Gallery.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean(),

  delete: (id) => Gallery.findByIdAndDelete(id),

  search: (query, filter = {}, options = {}) =>
    Gallery.find({ $text: { $search: query }, ...filter }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .lean(),

  searchCount: (query, filter = {}) =>
    Gallery.countDocuments({ $text: { $search: query }, ...filter }),
};

export default GalleryRepository;
