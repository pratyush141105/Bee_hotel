import BanquetHallRepository from '../repositories/banquetHall.repository.js';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '../utils/cloudinary.util.js';
import { buildQueryOptions, buildPaginationMeta } from '../utils/pagination.util.js';
import AppError from '../errors/AppError.js';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { MESSAGES } from '../constants/messages.constants.js';

const BanquetHallService = {
  listHalls: async (queryParams) => {
    const options = buildQueryOptions(queryParams);
    const filter = {};
    if (queryParams.status) filter.status = queryParams.status;

    const [halls, total] = await Promise.all([
      BanquetHallRepository.findAll(filter, options),
      BanquetHallRepository.count(filter),
    ]);
    return { halls, pagination: buildPaginationMeta(total, options.page, options.limit) };
  },

  getHallById: async (id) => {
    const hall = await BanquetHallRepository.findById(id);
    if (!hall) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return hall;
  },

  createHall: async (data, imageFiles) => {
    if (imageFiles && imageFiles.length > 0) {
      const results = await Promise.all(
        imageFiles.map((f) => uploadToCloudinary(f.buffer, 'hotel_bee/banquet'))
      );
      data.images = results.map((r) => r.url);
    }
    return BanquetHallRepository.create(data);
  },

  updateHall: async (id, data, imageFiles) => {
    const existing = await BanquetHallRepository.findById(id);
    if (!existing) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

    if (imageFiles && imageFiles.length > 0) {
      // Delete old images
      if (existing.images?.length) {
        await Promise.all(
          existing.images.map((url) => deleteFromCloudinary(extractPublicId(url)))
        );
      }
      const results = await Promise.all(
        imageFiles.map((f) => uploadToCloudinary(f.buffer, 'hotel_bee/banquet'))
      );
      data.images = results.map((r) => r.url);
    }

    return BanquetHallRepository.update(id, data);
  },

  deleteHall: async (id) => {
    const existing = await BanquetHallRepository.findById(id);
    if (!existing) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

    if (existing.images?.length) {
      await Promise.all(
        existing.images.map((url) => deleteFromCloudinary(extractPublicId(url)))
      );
    }

    await BanquetHallRepository.delete(id);
  },
};

export default BanquetHallService;
