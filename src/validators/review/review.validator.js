import { z } from 'zod';

export const createReviewBodySchema = z.object({
  customerName: z.string().min(1, 'Customer name is required.').max(100).trim(),
  rating: z.number({ required_error: 'Rating is required.' }).int().min(1).max(5),
  review: z.string().min(1, 'Review text is required.').max(1000).trim(),
});

export const idParamsSchema = z.object({
  id: z.string().min(24).max(24, 'Invalid ID.'),
});

export const reviewQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  approved: z.enum(['true', 'false']).optional(),
  search: z.string().trim().optional(),
});
