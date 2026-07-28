import { z } from 'zod';

export const createEventBodySchema = z.object({
  title: z.string().min(1, 'Title is required.').max(200).trim(),
  description: z.string().trim().optional(),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), { message: 'Invalid date.' }),
  time: z.string().trim().optional(),
  category: z.string().trim().optional(),
  featured: z.boolean().default(false).optional(),
});

export const updateEventBodySchema = z.object({
  title: z.string().min(1).max(200).trim().optional(),
  description: z.string().trim().optional(),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), { message: 'Invalid date.' }).optional(),
  time: z.string().trim().optional(),
  category: z.string().trim().optional(),
  featured: z.boolean().optional(),
});

export const idParamsSchema = z.object({
  id: z.string().min(24).max(24, 'Invalid ID.'),
});

export const eventQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().default('date'),
  order: z.enum(['asc', 'desc']).default('asc'),
  featured: z.enum(['true', 'false']).optional(),
  category: z.string().trim().optional(),
  search: z.string().trim().optional(),
});
