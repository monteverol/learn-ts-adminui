import { prisma } from '../../db/client.js';
import type { Prisma } from '@prisma/client';

export type CreateJobCategory = Prisma.JobCategoryCreateInput;
export type UpdateJobCategory = Prisma.JobCategoryUpdateInput;

export const JobCategoryService = {
  create: (data: CreateJobCategory) =>
    prisma.jobCategory.create({ data }),

  findAll: () =>
    prisma.jobCategory.findMany({
      where: { deletedAt: null },
      include: {
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    }),

  findById: (id: string) =>
    prisma.jobCategory.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    }),

  update: (id: string, data: UpdateJobCategory) =>
    prisma.jobCategory.update({
      where: { id },
      data,
    }),

  softDelete: (id: string) =>
    prisma.jobCategory.update({
      where: { id },
      data: { deletedAt: new Date() },
    }),
};