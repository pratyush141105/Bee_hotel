import { z } from 'zod';

export const createCategoryBodySchema = z.object({
  name: z.string().min(1, 'Category name is required.').max(100).trim(),
  displayOrder: z.number().int().min(0).default(0).optional(),
});

export const updateCategoryBodySchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const idParamsSchema = z.object({
  id: z.string().min(24, 'Invalid ID.').max(24, 'Invalid ID.'),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.string().default('displayOrder'),
  order: z.enum(['asc', 'desc']).default('asc'),
}).optional();
