import CateringServiceRepository from '../repositories/cateringService.repository.js';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '../utils/cloudinary.util.js';
import { buildQueryOptions, buildPaginationMeta } from '../utils/pagination.util.js';
import AppError from '../errors/AppError.js';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { MESSAGES } from '../constants/messages.constants.js';

const CateringService = {
  listServices: async (queryParams) => {
    const options = buildQueryOptions(queryParams);
    const [services, total] = await Promise.all([
      CateringServiceRepository.findAll({}, options),
      CateringServiceRepository.count({}),
    ]);
    return { services, pagination: buildPaginationMeta(total, options.page, options.limit) };
  },

  getServiceById: async (id) => {
    const service = await CateringServiceRepository.findById(id);
    if (!service) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return service;
  },

  createService: async (data, imageFiles) => {
    if (imageFiles && imageFiles.length > 0) {
      const results = await Promise.all(
        imageFiles.map((f) => uploadToCloudinary(f.buffer, 'hotel_bee/catering'))
      );
      data.images = results.map((r) => r.url);
    }
    return CateringServiceRepository.create(data);
  },

  updateService: async (id, data, imageFiles) => {
    const existing = await CateringServiceRepository.findById(id);
    if (!existing) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

    if (imageFiles && imageFiles.length > 0) {
      if (existing.images?.length) {
        await Promise.all(existing.images.map((url) => deleteFromCloudinary(extractPublicId(url))));
      }
      const results = await Promise.all(
        imageFiles.map((f) => uploadToCloudinary(f.buffer, 'hotel_bee/catering'))
      );
      data.images = results.map((r) => r.url);
    }

    return CateringServiceRepository.update(id, data);
  },

  deleteService: async (id) => {
    const existing = await CateringServiceRepository.findById(id);
    if (!existing) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

    if (existing.images?.length) {
      await Promise.all(existing.images.map((url) => deleteFromCloudinary(extractPublicId(url))));
    }

    await CateringServiceRepository.delete(id);
  },
};

export default CateringService;
