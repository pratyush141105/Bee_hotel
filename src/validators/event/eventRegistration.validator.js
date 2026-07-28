import { z } from 'zod';

export const createRegistrationBodySchema = z.object({
  customerName: z.string().min(1, 'Customer name is required.').max(150).trim(),
  phone: z.string().min(7, 'Invalid phone number.').max(20).trim(),
  email: z.string().email('Invalid email.').toLowerCase(),
  numberOfGuests: z.number().int().min(1).default(1).optional(),
  specialRequest: z.string().max(500).trim().optional(),
});

export const eventIdParamsSchema = z.object({
  id: z.string().min(24).max(24, 'Invalid event ID.'),
});

export const registrationIdParamsSchema = z.object({
  id: z.string().min(24).max(24, 'Invalid registration ID.'),
});

export const registrationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  status: z.enum(['Pending', 'Confirmed', 'Cancelled', 'Attended']).optional(),
  eventId: z.string().optional(),
  search: z.string().trim().optional(),
});
