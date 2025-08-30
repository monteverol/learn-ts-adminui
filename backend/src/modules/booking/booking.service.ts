import { prisma } from '../../db/client.js';
import type { Prisma } from '@prisma/client';
import type { CreateBookingInput, UpdateBookingInput, BookingQueryInput } from './booking.schemas.js';

export type CreateBooking = Prisma.BookingCreateInput;
export type UpdateBooking = Prisma.BookingUpdateInput;

export const BookingService = {
  create: async (data: CreateBookingInput) => {
    // Verify that the service exists
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service || service.deletedAt) {
      throw new Error('Service not found');
    }

    return prisma.booking.create({
      data: {
        serviceId: data.serviceId,
        serviceName: data.serviceName,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        date: data.date,
        time: data.time,
        status: data.status || 'PENDING',
        provider: data.provider,
        price: data.price,
        address: data.address,
      },
      include: {
        service: {
          select: { id: true, name: true, category: true },
        },
      },
    });
  },

  findAll: async (query: BookingQueryInput = {}) => {
    const {
      serviceId,
      status,
      customerName,
      provider,
      dateFrom,
      dateTo,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;
    
    const where: Prisma.BookingWhereInput = {
      deletedAt: null,
      ...(serviceId && { serviceId }),
      ...(status && { status }),
      ...(customerName && { customerName: { contains: customerName, mode: 'insensitive' } }),
      ...(provider && { provider: { contains: provider, mode: 'insensitive' } }),
      ...(dateFrom && dateTo && {
        date: {
          gte: dateFrom,
          lte: dateTo,
        },
      }),
      ...(search && {
        OR: [
          { customerName: { contains: search, mode: 'insensitive' } },
          { serviceName: { contains: search, mode: 'insensitive' } },
          { provider: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { customerPhone: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          service: {
            select: { id: true, name: true, category: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  findById: (id: string) =>
    prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
      },
    }),

  update: async (id: string, data: UpdateBookingInput) => {
    // If serviceId is being updated, verify the new service exists
    if (data.serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: data.serviceId },
      });

      if (!service || service.deletedAt) {
        throw new Error('Service not found');
      }
    }

    return prisma.booking.update({
      where: { id },
      data: {
        ...(data.serviceId && { serviceId: data.serviceId }),
        ...(data.serviceName && { serviceName: data.serviceName }),
        ...(data.customerName && { customerName: data.customerName }),
        ...(data.customerPhone && { customerPhone: data.customerPhone }),
        ...(data.date && { date: data.date }),
        ...(data.time && { time: data.time }),
        ...(data.status && { status: data.status }),
        ...(data.provider && { provider: data.provider }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.address && { address: data.address }),
      },
      include: {
        service: {
          select: { id: true, name: true, category: true },
        },
      },
    });
  },

  softDelete: (id: string) =>
    prisma.booking.update({
      where: { id },
      data: { deletedAt: new Date() },
    }),

  getStats: async () => {
    const [totalBookings, pendingBookings, confirmedBookings, completedBookings, cancelledBookings] = await Promise.all([
      prisma.booking.count({ where: { deletedAt: null } }),
      prisma.booking.count({ where: { deletedAt: null, status: 'PENDING' } }),
      prisma.booking.count({ where: { deletedAt: null, status: 'CONFIRMED' } }),
      prisma.booking.count({ where: { deletedAt: null, status: 'COMPLETED' } }),
      prisma.booking.count({ where: { deletedAt: null, status: 'CANCELLED' } }),
    ]);

    const statusDistribution = await prisma.booking.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: { status: true },
    });

    const recentBookings = await prisma.booking.findMany({
      where: { deletedAt: null },
      include: {
        service: {
          select: { name: true, category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      inProgressBookings: totalBookings - pendingBookings - confirmedBookings - completedBookings - cancelledBookings,
      completedBookings,
      cancelledBookings,
      statusDistribution: statusDistribution.map(item => ({
        status: item.status,
        count: item._count.status,
      })),
      recentBookings,
    };
  },

  getByServiceId: async (serviceId: string) => {
    return prisma.booking.findMany({
      where: { 
        serviceId,
        deletedAt: null 
      },
      include: {
        service: {
          select: { id: true, name: true, category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};