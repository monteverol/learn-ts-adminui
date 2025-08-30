import { z } from 'zod';

export const createBookingSchema = z.object({
  serviceId: z.string().min(1, "Service ID is required"),
  serviceName: z.string().min(1, "Service name is required"),
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(1, "Customer phone is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  provider: z.string().min(1, "Provider is required"),
  price: z.union([z.number().positive(), z.string().transform(val => val === '' ? 0 : Number(val))]),
  address: z.string().min(1, "Address is required"),
});

export const updateBookingSchema = createBookingSchema.partial();

export const bookingQuerySchema = z.object({
  serviceId: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  customerName: z.string().optional(),
  provider: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['date', 'customerName', 'serviceName', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.string().transform(val => Number(val) || 1).optional(),
  limit: z.string().transform(val => Number(val) || 10).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type BookingQueryInput = z.infer<typeof bookingQuerySchema>;