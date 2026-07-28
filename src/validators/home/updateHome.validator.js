import { z } from 'zod';

const ctaButtonSchema = z.object({
  label: z.string().min(1).max(100).trim(),
  link: z.string().url('CTA link must be a valid URL.'),
  variant: z.enum(['primary', 'secondary', 'outline']).default('primary'),
});

const featuredSectionSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  subtitle: z.string().max(300).trim().optional(),
  image: z.string().optional(),
  link: z.string().optional(),
});

export const updateHomeBodySchema = z.object({
  tagline: z.string().max(200).trim().optional(),
  subtitle: z.string().max(300).trim().optional(),
  description: z.string().trim().optional(),
  featuredSections: z.array(featuredSectionSchema).optional(),
  ctaButtons: z.array(ctaButtonSchema).optional(),
});
