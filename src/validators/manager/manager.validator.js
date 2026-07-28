import { z } from 'zod';

export const createManagerBodySchema = z.object({
  name: z.string().min(1, 'Name is required.').max(100).trim(),
  department: z.string().min(1, 'Department is required.').trim(),
  phone: z.string().min(7).max(20).trim(),
  email: z.string().email('Invalid email.').toLowerCase(),
});

export const updateManagerBodySchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  department: z.string().trim().optional(),
  phone: z.string().min(7).max(20).trim().optional(),
  email: z.string().email('Invalid email.').toLowerCase().optional(),
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
