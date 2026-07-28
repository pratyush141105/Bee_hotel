import RestaurantCategoryService from '../services/restaurantCategory.service.js';
import MenuItemService from '../services/menuItem.service.js';
import { successResponse } from '../utils/response.util.js';
import { MESSAGES } from '../constants/messages.constants.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

// ─── Categories ────────────────────────────────────────────────

export const listCategories = async (req, res) => {
  const result = await RestaurantCategoryService.listCategories(req.query);
  successResponse(res, MESSAGES.FETCHED, result);
};

export const getCategoryById = async (req, res) => {
  const category = await RestaurantCategoryService.getCategoryById(req.params.id);
  successResponse(res, MESSAGES.FETCHED, { category });
};

export const createCategory = async (req, res) => {
  const category = await RestaurantCategoryService.createCategory(req.body, req.file);
  successResponse(res, MESSAGES.CREATED, { category }, HTTP_STATUS.CREATED);
};

export const updateCategory = async (req, res) => {
  const category = await RestaurantCategoryService.updateCategory(req.params.id, req.body, req.file);
  successResponse(res, MESSAGES.UPDATED, { category });
};

export const deleteCategory = async (req, res) => {
  await RestaurantCategoryService.deleteCategory(req.params.id);
  successResponse(res, MESSAGES.DELETED);
};

// ─── Menu Items ────────────────────────────────────────────────

export const listMenu = async (req, res) => {
  const result = await MenuItemService.listMenu(req.query);
  successResponse(res, MESSAGES.FETCHED, result);
};

export const getFeaturedMenu = async (req, res) => {
  const items = await MenuItemService.getFeaturedMenu();
  successResponse(res, MESSAGES.FETCHED, { items });
};

export const getMenuByCategory = async (req, res) => {
  const result = await MenuItemService.getMenuByCategory(req.params.categoryId, req.query);
  successResponse(res, MESSAGES.FETCHED, result);
};

export const getMenuItemById = async (req, res) => {
  const item = await MenuItemService.getMenuItemById(req.params.id);
  successResponse(res, MESSAGES.FETCHED, { item });
};

export const createMenuItem = async (req, res) => {
  const item = await MenuItemService.createMenuItem(req.body, req.file);
  successResponse(res, MESSAGES.CREATED, { item }, HTTP_STATUS.CREATED);
};

export const updateMenuItem = async (req, res) => {
  const item = await MenuItemService.updateMenuItem(req.params.id, req.body, req.file);
  successResponse(res, MESSAGES.UPDATED, { item });
};

export const deleteMenuItem = async (req, res) => {
  await MenuItemService.deleteMenuItem(req.params.id);
  successResponse(res, MESSAGES.DELETED);
};
