import RestaurantCategoryRepository from '../repositories/restaurantCategory.repository.js';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '../utils/cloudinary.util.js';
import { generateSimpleSlug } from '../utils/slug.util.js';
import { buildQueryOptions, buildPaginationMeta } from '../utils/pagination.util.js';
import AppError from '../errors/AppError.js';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { MESSAGES } from '../constants/messages.constants.js';

const RestaurantCategoryService = {
  listCategories: async (queryParams) => {
    const options = buildQueryOptions(queryParams);
    const [categories, total] = await Promise.all([
      RestaurantCategoryRepository.findAll({}, options),
      RestaurantCategoryRepository.count({}),
    ]);
    return { categories, pagination: buildPaginationMeta(total, options.page, options.limit) };
  },

  getCategoryById: async (id) => {
    const category = await RestaurantCategoryRepository.findById(id);
    if (!category) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return category;
  },

  createCategory: async (data, imageFile) => {
    data.slug = generateSimpleSlug(data.name);

    if (imageFile) {
      const { url } = await uploadToCloudinary(imageFile.buffer, 'hotel_bee/categories');
      data.image = url;
    }

    return RestaurantCategoryRepository.create(data);
  },

  updateCategory: async (id, data, imageFile) => {
    const existing = await RestaurantCategoryRepository.findById(id);
    if (!existing) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

    if (data.name) {
      data.slug = generateSimpleSlug(data.name);
    }

    if (imageFile) {
      // Delete old image from Cloudinary
      if (existing.image) {
        await deleteFromCloudinary(extractPublicId(existing.image));
      }
      const { url } = await uploadToCloudinary(imageFile.buffer, 'hotel_bee/categories');
      data.image = url;
    }

    return RestaurantCategoryRepository.update(id, data);
  },

  deleteCategory: async (id) => {
    const existing = await RestaurantCategoryRepository.findById(id);
    if (!existing) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

    if (existing.image) {
      await deleteFromCloudinary(extractPublicId(existing.image));
    }

    await RestaurantCategoryRepository.delete(id);
  },
};

export default RestaurantCategoryService;
