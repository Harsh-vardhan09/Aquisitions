import { z } from 'zod';

export const userIdSchema = z.object({
  id: z.coerce.number().int().positive('Invalid user id'),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1).max(50).optional(),
    email: z.string().max(255).toLowerCase().trim().email('Invalid email address').optional(),
    role: z.enum(['user', 'admin']).optional(),
  })
  .strict()
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });
