import { z } from 'zod';

export const createBranchBodySchema = z.object({
  branchName: z.string().min(1, 'Branch name is required.').max(150).trim(),
  address: z.string().min(1, 'Address is required.').trim(),
  phone: z.string().min(7).max(20).trim(),
  map: z.string().trim().optional(),
  isActive: z.boolean().default(true).optional(),
});

export const updateBranchBodySchema = z.object({
  branchName: z.string().min(1).max(150).trim().optional(),
  address: z.string().trim().optional(),
  phone: z.string().min(7).max(20).trim().optional(),
  map: z.string().trim().optional(),
  isActive: z.boolean().optional(),
});

export const idParamsSchema = z.object({
  id: z.string().min(24).max(24, 'Invalid ID.'),
});

export const branchQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  isActive: z.enum(['true', 'false']).optional(),
});
