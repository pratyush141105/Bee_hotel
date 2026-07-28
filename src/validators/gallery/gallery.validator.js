import { z } from 'zod';

export const uploadGalleryBodySchema = z.object({
  title: z.string().max(200).trim().optional(),
  type: z.enum(['image', 'video'], { required_error: 'Media type is required.' }),
  category: z.string().trim().optional(),
  displayOrder: z.coerce.number().int().min(0).default(0).optional(),
});

export const updateGalleryBodySchema = z.object({
  title: z.string().max(200).trim().optional(),
  category: z.string().trim().optional(),
  displayOrder: z.coerce.number().int().min(0).optional(),
});

export const idParamsSchema = z.object({
  id: z.string().min(24).max(24, 'Invalid ID.'),
});

export const galleryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().default('displayOrder'),
  order: z.enum(['asc', 'desc']).default('asc'),
  type: z.enum(['image', 'video']).optional(),
  category: z.string().trim().optional(),
  search: z.string().trim().optional(),
});
