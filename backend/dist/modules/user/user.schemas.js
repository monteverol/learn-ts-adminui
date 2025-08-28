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
    tags: z.array(z.string()).optional(),
    workExperience: z.array(z.object({
        company: z.string(),
        position: z.string(),
        startDate: z.string(),
        endDate: z.string().optional(),
        isCurrent: z.boolean().optional(),
        description: z.string().optional(),
        responsibilities: z.array(z.string()).optional(),
    })).optional(),
});
export const updateUserSchema = createUserSchema.partial();
