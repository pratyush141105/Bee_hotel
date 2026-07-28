import { z } from 'zod';

export const updateProfileBodySchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  email: z.string().email('Invalid email format.').toLowerCase().optional(),
}).refine((data) => data.name || data.email, {
  message: 'At least one field (name or email) must be provided.',
});
