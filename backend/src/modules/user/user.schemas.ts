import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  age: z.number().int().nonnegative().optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
  jobTitle: z.string().optional(),
  jobCategory: z.enum(['MAINTENANCE', 'OPERATIONS', 'OTHER']).optional(),
  yearsExperience: z.number().int().nonnegative().optional(),
  bio: z.string().optional(),
  description: z.string().optional(),
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
