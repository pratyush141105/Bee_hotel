import { z } from 'zod';

export const loginBodySchema = z.object({
  email: z.string().email('Invalid email format.').toLowerCase(),
  password: z.string().min(1, 'Password is required.'),
});
