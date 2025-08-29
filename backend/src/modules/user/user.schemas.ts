import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1),
  address: z.union([z.string(), z.literal('')]).optional(),
  age: z.union([z.number(), z.string().transform(val => val === '' ? undefined : Number(val))]).optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
  jobTitle: z.union([z.string(), z.literal('')]).optional(),
  jobCategory: z.enum(['MAINTENANCE', 'OPERATIONS', 'OTHER']).optional(),
  yearsExperience: z.union([z.number(), z.string().transform(val => val === '' ? undefined : Number(val))]).optional(),
  bio: z.union([z.string(), z.literal('')]).optional(),
  description: z.union([z.string(), z.literal('')]).optional(),
  tags: z.array(z.string()).optional(),
  workExperience: z.array(z.object({
    company: z.string().min(1, "Company is required"),
    position: z.string().min(1, "Position is required"), 
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.union([z.string().min(1), z.null(), z.literal('')]).optional().transform(val => val === '' ? null : val),
    isCurrent: z.boolean().optional(),
    description: z.union([z.string(), z.literal('')]).optional(),
    responsibilities: z.array(z.string()).optional(),
  })).optional(),
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
