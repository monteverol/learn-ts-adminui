import { prisma } from '../../db/client.js';
import type { Prisma } from '@prisma/client';

export type CreateUser = Prisma.UserCreateInput;     // name required
export type UpdateUser = Prisma.UserUpdateInput;

const parseYYYYMM = (ym: string | null) => {
  if (!ym) return null;
  
  // Try parsing as ISO date string first
  const date = new Date(ym);
  if (!isNaN(date.getTime())) {
    return date;
  }
  
  // Handle YYYY-MM format
  if (ym.match(/^\d{4}-\d{2}$/)) {
    const parsedDate = new Date(`${ym}-01T00:00:00.000Z`);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }
  
  return null;
};

export const UserService = {
  create: async (data: any) => {
    const { tags, workExperience, ...userData } = data;
    
    // Handle tags - create or connect existing ones
    const tagIds: string[] = [];
    if (tags && Array.isArray(tags)) {
      for (const tagName of tags) {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });
        tagIds.push(tag.id);
      }
    }

    // Create user with tags
    const user = await prisma.user.create({
      data: {
        ...userData,
        tags: tagIds.length > 0 ? { connect: tagIds.map((id) => ({ id })) } : undefined,
      },
      include: {
        tags: true,
        workExperience: { include: { responsibilities: true } },
      },
    });

    // Handle work experience
    if (workExperience && Array.isArray(workExperience)) {
      for (const wx of workExperience) {
        const startDate = parseYYYYMM(wx.startDate);
        if (!startDate) {
          throw new Error(`Invalid startDate format: ${wx.startDate}`);
        }
        
        const createdWX = await prisma.workExperience.create({
          data: {
            userId: user.id,
            company: wx.company,
            position: wx.position,
            startDate,
            endDate: parseYYYYMM(wx.endDate),
            isCurrent: !!wx.isCurrent,
            description: wx.description || null,
          },
        });

        if (wx.responsibilities?.length) {
          await prisma.responsibility.createMany({
            data: wx.responsibilities.map((title: string) => ({
              workExperienceId: createdWX.id,
              title,
            })),
          });
        }
      }
    }

    // Return user with all relations
    return prisma.user.findUnique({
      where: { id: user.id },
      include: {
        tags: true,
        workExperience: { include: { responsibilities: true } },
      },
    });
  },

  findAll: () =>
    prisma.user.findMany({
      where: { deletedAt: null },
      include: {
        tags: true,
        workExperience: { include: { responsibilities: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),

  findById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      include: {
        tags: true,
        workExperience: { include: { responsibilities: true } },
      },
    }),

  update: async (id: string, data: any) => {
    const { tags, workExperience, ...userData } = data;
    
    // Handle tags if provided
    if (tags !== undefined) {
      const tagIds: string[] = [];
      if (Array.isArray(tags)) {
        for (const tagName of tags) {
          const tag = await prisma.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          });
          tagIds.push(tag.id);
        }
      }
      userData.tags = { set: [], connect: tagIds.map((id) => ({ id })) };
    }

    // Handle work experience if provided
    if (workExperience !== undefined) {
      // Remove existing work experience
      const existingWX = await prisma.workExperience.findMany({
        where: { userId: id },
        select: { id: true },
      });
      if (existingWX.length) {
        await prisma.responsibility.deleteMany({
          where: { workExperienceId: { in: existingWX.map((w) => w.id) } },
        });
        await prisma.workExperience.deleteMany({
          where: { id: { in: existingWX.map((w) => w.id) } },
        });
      }

      // Add new work experience
      if (Array.isArray(workExperience)) {
        for (const wx of workExperience) {
          const startDate = parseYYYYMM(wx.startDate);
          if (!startDate) {
            throw new Error(`Invalid startDate format: ${wx.startDate}`);
          }
          
          const createdWX = await prisma.workExperience.create({
            data: {
              userId: id,
              company: wx.company,
              position: wx.position,
              startDate,
              endDate: parseYYYYMM(wx.endDate),
              isCurrent: !!wx.isCurrent,
              description: wx.description || null,
            },
          });

          if (wx.responsibilities?.length) {
            await prisma.responsibility.createMany({
              data: wx.responsibilities.map((title: string) => ({
                workExperienceId: createdWX.id,
                title,
              })),
            });
          }
        }
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData,
      include: {
        tags: true,
        workExperience: { include: { responsibilities: true } },
      },
    });

    return updatedUser;
  },

  softDelete: (id: string) =>
    prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    }),
};
