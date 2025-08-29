import { prisma } from '../../db/client.js';
import type { Prisma } from '@prisma/client';

export type CreateJobCategory = Prisma.JobCategoryCreateInput;
export type UpdateJobCategory = Prisma.JobCategoryUpdateInput;

export const JobCategoryService = {
  create: async (data: any) => {
    const { tags, ...categoryData } = data;
    
    const jobCategory = await prisma.jobCategory.create({
      data: categoryData,
      include: {
        tags: true,
      },
    });

    // Handle tags if provided
    if (Array.isArray(tags) && tags.length > 0) {
      await prisma.jobCategoryTag.createMany({
        data: tags.filter(tag => tag && typeof tag === 'string').map((tagName: string) => ({
          name: tagName,
          jobCategoryId: jobCategory.id,
        })),
      });
    }

    // Return job category with tags
    return prisma.jobCategory.findUnique({
      where: { id: jobCategory.id },
      include: {
        tags: true,
      },
    });
  },

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

  update: async (id: string, data: any) => {
    const { tags, ...categoryData } = data;

    // Handle tags if provided
    if (tags !== undefined) {
      // Remove existing tags
      await prisma.jobCategoryTag.deleteMany({
        where: { jobCategoryId: id },
      });

      // Add new tags
      if (Array.isArray(tags) && tags.length > 0) {
        await prisma.jobCategoryTag.createMany({
          data: tags.filter(tag => tag && typeof tag === 'string').map((tagName: string) => ({
            name: tagName,
            jobCategoryId: id,
          })),
        });
      }
    }

    // Update job category
    return prisma.jobCategory.update({
      where: { id },
      data: categoryData,
      include: {
        tags: true,
      },
    });
  },

  archive: (id: string) =>
    prisma.jobCategory.update({
      where: { id },
      data: { 
        status: 'ARCHIVED',
        updatedAt: new Date()
      },
      include: {
        tags: true,
      },
    }),

  activate: (id: string) =>
    prisma.jobCategory.update({
      where: { id },
      data: { 
        status: 'ACTIVE',
        updatedAt: new Date()
      },
      include: {
        tags: true,
      },
    }),

  softDelete: (id: string) =>
    prisma.jobCategory.update({
      where: { id },
      data: { deletedAt: new Date() },
    }),
};