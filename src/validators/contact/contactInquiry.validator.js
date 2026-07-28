import { z } from 'zod';

export const createContactInquiryBodySchema = z.object({
  customerName: z.string().min(1, 'Name is required.').max(150).trim(),
  email: z.string().email('Invalid email.').toLowerCase(),
  phone: z.string().min(7).max(20).trim().optional(),
  subject: z.string().min(1, 'Subject is required.').max(200).trim(),
  message: z.string().min(1, 'Message is required.').max(2000).trim(),
});

export const inquiryIdParamsSchema = z.object({
  id: z.string().min(24).max(24, 'Invalid ID.'),
});

export const contactInquiryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  status: z.enum(['Unread', 'Read', 'Closed']).optional(),
  search: z.string().trim().optional(),
});
