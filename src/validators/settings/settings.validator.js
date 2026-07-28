import { z } from 'zod';

export const updateSettingsBodySchema = z.object({
  swiggyLink: z.string().url('Must be a valid URL.').trim().optional().or(z.literal('')),
  zomatoLink: z.string().url('Must be a valid URL.').trim().optional().or(z.literal('')),
  darkModeDefault: z.boolean().optional(),
  websiteTitle: z.string().max(200).trim().optional(),
});
