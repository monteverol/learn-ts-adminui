import { prisma } from '../../db/client.js';
import type { Prisma } from '@prisma/client';
import type { CreateServiceInput, UpdateServiceInput, ServiceQueryInput } from './service.schemas.js';

export type CreateService = Prisma.ServiceCreateInput;
export type UpdateService = Prisma.ServiceUpdateInput;

export const ServiceService = {
  create: async (data: CreateServiceInput) => {
    return prisma.service.create({
      data: {
        name: data.name,
        category: data.category,
        price: data.price,
        duration: data.duration,
        status: data.status || 'ACTIVE',
        description: data.description || null,
        providersCount: data.providersCount || 0,
      },
      include: {
        bookings: {
          select: { id: true, status: true },
        },
      },
    });
  },

  findAll: async (query: ServiceQueryInput = {}) => {
    const {
      category,
      status,
      search,
      sortBy: rawSortBy = 'createdAt',
      sortOrder: rawSortOrder = 'desc',
      sort,
      page = 1,
      limit: rawLimit = 10,
      pageSize,
    } = query;

    // Handle pageSize parameter (frontend uses pageSize, backend traditionally uses limit)
    const limit = pageSize || rawLimit;

    // Handle sort parameter in field:direction format
    let sortBy = rawSortBy;
    let sortOrder = rawSortOrder;
    
    if (sort) {
      const [field, direction] = sort.split(':');
      if (field && direction) {
        sortBy = field as any;
        sortOrder = direction as any;
      }
    }

    const skip = (page - 1) * limit;
    
    const where: Prisma.ServiceWhereInput = {
      deletedAt: null,
      ...(category && { category: { contains: category, mode: 'insensitive' } }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: {
          bookings: {
            select: { id: true, status: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.service.count({ where }),
    ]);

    return {
      items: services, // Hook expects 'items' property
      total,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  findById: (id: string) =>
    prisma.service.findUnique({
      where: { id },
      include: {
        bookings: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
      },
    }),

  update: async (id: string, data: UpdateServiceInput) => {
    return prisma.service.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.category && { category: data.category }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.duration && { duration: data.duration }),
        ...(data.status && { status: data.status }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.providersCount !== undefined && { providersCount: data.providersCount }),
      },
      include: {
        bookings: {
          select: { id: true, status: true },
        },
      },
    });
  },

  softDelete: (id: string) =>
    prisma.service.update({
      where: { id },
      data: { deletedAt: new Date() },
    }),

  getStats: async () => {
    const [totalServices, activeServices, totalBookings] = await Promise.all([
      prisma.service.count({ where: { deletedAt: null } }),
      prisma.service.count({ where: { deletedAt: null, status: 'ACTIVE' } }),
      prisma.booking.count({ where: { deletedAt: null } }),
    ]);

    const categoriesData = await prisma.service.groupBy({
      by: ['category'],
      where: { deletedAt: null },
      _count: { category: true },
    });

    return {
      totalServices,
      activeServices,
      inactiveServices: totalServices - activeServices,
      totalBookings,
      categories: categoriesData.map(item => ({
        category: item.category,
        count: item._count.category,
      })),
    };
  },
};