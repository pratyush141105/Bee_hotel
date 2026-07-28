import { z } from 'zod';

export const createCateringInquiryBodySchema = z.object({
  customerName: z.string().min(1, 'Customer name is required.').max(150).trim(),
  phone: z.string().min(7, 'Invalid phone number.').max(20).trim(),
  email: z.string().email('Invalid email.').toLowerCase(),
  eventDate: z.string().refine((d) => !isNaN(Date.parse(d)), { message: 'Invalid event date.' }),
  eventTime: z.string().trim().optional(),
  location: z.string().min(1, 'Event location is required.').trim(),
  numberOfGuests: z.number({ required_error: 'Number of guests is required.' }).int().min(1),
  selectedPackage: z.string().min(24).max(24, 'Invalid package ID.').optional(),
  foodRequirements: z.string().trim().optional(),
  additionalRequirements: z.string().trim().optional(),
});

export const inquiryIdParamsSchema = z.object({
  id: z.string().min(24).max(24, 'Invalid ID.'),
});

export const inquiryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  status: z.enum(['Pending', 'Confirmed', 'Rejected', 'Completed']).optional(),
  search: z.string().trim().optional(),
  date: z.string().optional(),
});
