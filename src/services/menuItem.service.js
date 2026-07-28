import MenuItemRepository from '../repositories/menuItem.repository.js';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '../utils/cloudinary.util.js';
import { buildQueryOptions, buildPaginationMeta } from '../utils/pagination.util.js';
import AppError from '../errors/AppError.js';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { MESSAGES } from '../constants/messages.constants.js';

const MenuItemService = {
  listMenu: async (queryParams) => {
    const { search, categoryId, veg, featured, isAvailable } = queryParams;
    const options = buildQueryOptions(queryParams);

    // Build dynamic filter
    const filter = {};
    if (categoryId) filter.categoryId = categoryId;
    if (veg !== undefined) filter.veg = veg === 'true';
    if (featured !== undefined) filter.featured = featured === 'true';
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';

    // Use text search if search term provided
    if (search) {
      const [items, total] = await Promise.all([
        MenuItemRepository.search(search, options),
        MenuItemRepository.searchCount(search),
      ]);
      return { items, pagination: buildPaginationMeta(total, options.page, options.limit) };
    }

    const [items, total] = await Promise.all([
      MenuItemRepository.findAll(filter, options),
      MenuItemRepository.count(filter),
    ]);
    return { items, pagination: buildPaginationMeta(total, options.page, options.limit) };
  },

  getFeaturedMenu: async () => {
    const items = await MenuItemRepository.findAll({ featured: true, isAvailable: true }, { limit: 20, sort: { createdAt: -1 } });
    return items;
  },

  getMenuByCategory: async (categoryId, queryParams) => {
    const options = buildQueryOptions(queryParams);
    const filter = { categoryId };
    const [items, total] = await Promise.all([
      MenuItemRepository.findAll(filter, options),
      MenuItemRepository.count(filter),
    ]);
    return { items, pagination: buildPaginationMeta(total, options.page, options.limit) };
  },

  getMenuItemById: async (id) => {
    const item = await MenuItemRepository.findById(id);
    if (!item) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return item;
  },

  createMenuItem: async (data, imageFile) => {
    if (imageFile) {
      const { url } = await uploadToCloudinary(imageFile.buffer, 'hotel_bee/menu');
      data.image = url;
    }
    return MenuItemRepository.create(data);
  },

  updateMenuItem: async (id, data, imageFile) => {
    const existing = await MenuItemRepository.findById(id);
    if (!existing) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

    if (imageFile) {
      if (existing.image) {
        await deleteFromCloudinary(extractPublicId(existing.image));
      }
      const { url } = await uploadToCloudinary(imageFile.buffer, 'hotel_bee/menu');
      data.image = url;
    }

    return MenuItemRepository.update(id, data);
  },

  deleteMenuItem: async (id) => {
    const existing = await MenuItemRepository.findById(id);
    if (!existing) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

    if (existing.image) {
      await deleteFromCloudinary(extractPublicId(existing.image));
    }

    await MenuItemRepository.delete(id);
  },
};

export default MenuItemService;
