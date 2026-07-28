import { z } from 'zod';

export const createHallBodySchema = z.object({
  name: z.string().min(1, 'Hall name is required.').max(150).trim(),
  description: z.string().trim().optional(),
  capacity: z.number({ required_error: 'Capacity is required.' }).int().min(1),
  amenities: z.array(z.string().trim()).optional(),
  pricePerDay: z.number({ required_error: 'Price per day is required.' }).min(0),
  status: z.enum(['Active', 'Inactive', 'Under Maintenance']).default('Active').optional(),
});

export const updateHallBodySchema = z.object({
  name: z.string().min(1).max(150).trim().optional(),
  description: z.string().trim().optional(),
  capacity: z.number().int().min(1).optional(),
  amenities: z.array(z.string().trim()).optional(),
  pricePerDay: z.number().min(0).optional(),
  status: z.enum(['Active', 'Inactive', 'Under Maintenance']).optional(),
});

export const idParamsSchema = z.object({
  id: z.string().min(24).max(24, 'Invalid ID.'),
});

export const hallQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  status: z.enum(['Active', 'Inactive', 'Under Maintenance']).optional(),
});
