import { z } from 'zod';

export const createBookingBodySchema = z.object({
  customerName: z.string().min(1, 'Customer name is required.').max(150).trim(),
  phone: z.string().min(7, 'Invalid phone number.').max(20).trim(),
  email: z.string().email('Invalid email.').toLowerCase(),
  hall: z.string().min(24).max(24, 'Invalid hall ID.'),
  eventType: z.string().min(1, 'Event type is required.').trim(),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), { message: 'Invalid date.' }),
  time: z.string().min(1, 'Time is required.').trim(),
  numberOfGuests: z.number({ required_error: 'Number of guests is required.' }).int().min(1),
  foodRequirement: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export const idParamsSchema = z.object({
  id: z.string().min(24).max(24, 'Invalid ID.'),
});

export const bookingQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  status: z.enum(['Pending', 'Confirmed', 'Rejected', 'Completed']).optional(),
  hall: z.string().optional(),
  date: z.string().optional(),
});
