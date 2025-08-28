import { z } from 'zod';
export const createJobCategorySchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
    jobsCount: z.number().int().nonnegative().optional(),
    avgPrice: z.number().nonnegative().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
});
export const updateJobCategorySchema = createJobCategorySchema.partial();
