import { Router } from 'express';
import * as restaurantController from '../controllers/restaurant.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { uploadSingleImage } from '../middlewares/upload.middleware.js';
import {
  createCategoryBodySchema,
  updateCategoryBodySchema,
  idParamsSchema as catIdSchema,
  paginationQuerySchema,
} from '../validators/restaurant/category.validator.js';
import {
  createMenuItemBodySchema,
  updateMenuItemBodySchema,
  idParamsSchema as menuIdSchema,
  categoryParamsSchema,
  menuQuerySchema,
} from '../validators/restaurant/menuItem.validator.js';

const router = Router();

// ─── Category Routes ────────────────────────────────────────

router.get('/categories', validate({ query: paginationQuerySchema }), restaurantController.listCategories);
router.get('/categories/:id', validate({ params: catIdSchema }), restaurantController.getCategoryById);

router.post(
  '/categories',
  authenticateAdmin,
  uploadSingleImage('image'),
  validate({ body: createCategoryBodySchema }),
  restaurantController.createCategory
);
router.put(
  '/categories/:id',
  authenticateAdmin,
  uploadSingleImage('image'),
  validate({ params: catIdSchema, body: updateCategoryBodySchema }),
  restaurantController.updateCategory
);
router.delete(
  '/categories/:id',
  authenticateAdmin,
  validate({ params: catIdSchema }),
  restaurantController.deleteCategory
);

// ─── Menu Item Routes ───────────────────────────────────────

router.get('/menu', validate({ query: menuQuerySchema }), restaurantController.listMenu);
router.get('/menu/featured', restaurantController.getFeaturedMenu);
router.get('/menu/category/:categoryId', validate({ params: categoryParamsSchema }), restaurantController.getMenuByCategory);
router.get('/menu/:id', validate({ params: menuIdSchema }), restaurantController.getMenuItemById);

router.post(
  '/menu',
  authenticateAdmin,
  uploadSingleImage('image'),
  validate({ body: createMenuItemBodySchema }),
  restaurantController.createMenuItem
);
router.put(
  '/menu/:id',
  authenticateAdmin,
  uploadSingleImage('image'),
  validate({ params: menuIdSchema, body: updateMenuItemBodySchema }),
  restaurantController.updateMenuItem
);
router.delete(
  '/menu/:id',
  authenticateAdmin,
  validate({ params: menuIdSchema }),
  restaurantController.deleteMenuItem
);

export default router;
