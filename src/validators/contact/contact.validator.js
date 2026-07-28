import { z } from 'zod';

const workingHoursSchema = z.object({
  day: z.string().trim(),
  hours: z.string().trim(),
});

export const updateContactBodySchema = z.object({
  hotelName: z.string().trim().optional(),
  address: z.string().trim().optional(),
  phone: z.array(z.string().trim()).optional(),
  email: z.array(z.string().email()).optional(),
  googleMap: z.string().trim().optional(),
  workingHours: z.array(workingHoursSchema).optional(),
});
