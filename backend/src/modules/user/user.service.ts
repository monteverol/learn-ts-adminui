import { prisma } from '../../db/client.js';
import type { Prisma } from '@prisma/client';

export type CreateUser = Prisma.UserCreateInput;     // name required
export type UpdateUser = Prisma.UserUpdateInput;

export const UserService = {
  create: (data: CreateUser) =>
    prisma.user.create({ data }),

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

  update: (id: string, data: UpdateUser) =>
    prisma.user.update({
      where: { id },
      data,
    }),

  softDelete: (id: string) =>
    prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    }),
};
