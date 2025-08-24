import { prisma } from '../../db/client';

export const UserService = {
  create: (data: { email: string; name?: string }) =>
    prisma.user.create({ data }),
  findAll: () => prisma.user.findMany(),
  findById: (id: string) => prisma.user.findUnique({ where: { id } }),
  update: (id: string, data: { name?: string }) =>
    prisma.user.update({ where: { id }, data }),
  remove: (id: string) => prisma.user.delete({ where: { id } }),
};
