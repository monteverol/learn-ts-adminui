import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.union([z.number().positive(), z.string().transform(val => val === '' ? 0 : Number(val))]),
  duration: z.string().min(1, "Duration is required"),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  description: z.union([z.string(), z.literal('')]).optional(),
  providersCount: z.union([z.number().int().min(0), z.string().transform(val => val === '' ? 0 : Number(val))]).optional(),
});

export const updateServiceSchema = createServiceSchema.partial();

export const serviceQuerySchema = z.object({
  category: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'price', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  sort: z.string().optional(), // Support field:direction format from frontend
  page: z.string().transform(val => Number(val) || 1).optional(),
  limit: z.string().transform(val => Number(val) || 10).optional(),
  pageSize: z.string().transform(val => Number(val) || 10).optional(), // Support pageSize parameter
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type ServiceQueryInput = z.infer<typeof serviceQuerySchema>;