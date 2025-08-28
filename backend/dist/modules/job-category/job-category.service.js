import { prisma } from '../../db/client.js';
export const JobCategoryService = {
    create: (data) => prisma.jobCategory.create({ data }),
    findAll: () => prisma.jobCategory.findMany({
        where: { deletedAt: null },
        include: {
            tags: true,
        },
        orderBy: { createdAt: 'desc' },
    }),
    findById: (id) => prisma.jobCategory.findUnique({
        where: { id },
        include: {
            tags: true,
        },
    }),
    update: (id, data) => prisma.jobCategory.update({
        where: { id },
        data,
    }),
    softDelete: (id) => prisma.jobCategory.update({
        where: { id },
        data: { deletedAt: new Date() },
    }),
};
