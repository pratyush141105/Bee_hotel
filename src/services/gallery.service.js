import GalleryRepository from '../repositories/gallery.repository.js';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '../utils/cloudinary.util.js';
import { buildQueryOptions, buildPaginationMeta } from '../utils/pagination.util.js';
import AppError from '../errors/AppError.js';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { MESSAGES } from '../constants/messages.constants.js';

const GalleryService = {
  listGallery: async (queryParams) => {
    const { search, type, category } = queryParams;
    const options = buildQueryOptions(queryParams);
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;

    if (search) {
      const [items, total] = await Promise.all([
        GalleryRepository.search(search, filter, options),
        GalleryRepository.searchCount(search, filter),
      ]);
      return { items, pagination: buildPaginationMeta(total, options.page, options.limit) };
    }

    const [items, total] = await Promise.all([
      GalleryRepository.findAll(filter, options),
      GalleryRepository.count(filter),
    ]);
    return { items, pagination: buildPaginationMeta(total, options.page, options.limit) };
  },

  uploadMedia: async (data, file) => {
    if (!file) throw new AppError('No file provided.', HTTP_STATUS.BAD_REQUEST);

    const resourceType = data.type === 'video' ? 'video' : 'image';
    const folder = `hotel_bee/gallery/${resourceType}s`;
    const { url } = await uploadToCloudinary(file.buffer, folder, resourceType);
    data.url = url;

    return GalleryRepository.create(data);
  },

  updateGalleryItem: async (id, data) => {
    const existing = await GalleryRepository.findById(id);
    if (!existing) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return GalleryRepository.update(id, data);
  },

  deleteGalleryItem: async (id) => {
    const existing = await GalleryRepository.findById(id);
    if (!existing) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

    const resourceType = existing.type === 'video' ? 'video' : 'image';
    if (existing.url) {
      await deleteFromCloudinary(extractPublicId(existing.url), resourceType);
    }

    await GalleryRepository.delete(id);
  },
};

export default GalleryService;
