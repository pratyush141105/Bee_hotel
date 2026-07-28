import { z } from 'zod';

export const createMenuItemBodySchema = z.object({
  name: z.string().min(1, 'Name is required.').max(150).trim(),
  description: z.string().max(500).trim().optional(),
  price: z.number({ required_error: 'Price is required.' }).min(0),
  categoryId: z.string().min(24).max(24, 'Invalid category ID.'),
  isAvailable: z.boolean().default(true).optional(),
  veg: z.boolean().default(true).optional(),
  featured: z.boolean().default(false).optional(),
});

export const updateMenuItemBodySchema = z.object({
  name: z.string().min(1).max(150).trim().optional(),
  description: z.string().max(500).trim().optional(),
  price: z.number().min(0).optional(),
  categoryId: z.string().min(24).max(24).optional(),
  isAvailable: z.boolean().optional(),
  veg: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export const idParamsSchema = z.object({
  id: z.string().min(24).max(24, 'Invalid ID.'),
});

export const categoryParamsSchema = z.object({
  categoryId: z.string().min(24).max(24, 'Invalid category ID.'),
});

export const menuQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().trim().optional(),
  categoryId: z.string().optional(),
  veg: z.enum(['true', 'false']).optional(),
  featured: z.enum(['true', 'false']).optional(),
  isAvailable: z.enum(['true', 'false']).optional(),
});
