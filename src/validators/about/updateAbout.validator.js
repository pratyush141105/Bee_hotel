import { z } from 'zod';

export const updateAboutBodySchema = z.object({
  title: z.string().max(200).trim().optional(),
  description: z.string().trim().optional(),
  since: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  mission: z.string().trim().optional(),
  vision: z.string().trim().optional(),
  services: z.array(z.string().trim()).optional(),
});
