import { z } from 'zod';

export const createCateringBodySchema = z.object({
  name: z.string().min(1, 'Name is required.').max(150).trim(),
  description: z.string().trim().optional(),
  price: z.number().min(0).optional(),
  features: z.array(z.string().trim()).optional(),
});

export const updateCateringBodySchema = z.object({
  name: z.string().min(1).max(150).trim().optional(),
  description: z.string().trim().optional(),
  price: z.number().min(0).optional(),
  features: z.array(z.string().trim()).optional(),
});

export const idParamsSchema = z.object({
  id: z.string().min(24).max(24, 'Invalid ID.'),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});
