import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
});