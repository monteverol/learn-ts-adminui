import { prisma } from './client.js';
import { UserStatus, JobCategory } from '@prisma/client';

const seed = [
  {
    id: 'user1',
    name: 'John Brown',
    address: 'New York No. 1 Lake Park',
    age: 32,
    status: 'ACTIVE',
    tags: ['Maintenance', 'Gardening', 'Housekeeping'],
    jobTitle: 'Maintenance Technician',
    jobCategory: 'MAINTENANCE',
    yearsExperience: 6,
    bio: 'Detail-oriented tech keeping facilities in top shape.',
    description: 'Specializes in preventive maintenance and scheduling.',
    workExperience: [
      {
        id: 'exp1',
        company: 'Metropolitan Facilities Inc.',
        position: 'Senior Maintenance Technician',
        startDate: '2020-03',
        endDate: null,
        isCurrent: true,
        description:
          'Lead maintenance operations for 50+ residential buildings. Implemented preventive maintenance schedules that reduced emergency repairs by 40%.',
        responsibilities: [
          'Supervise team of 5 maintenance staff',
          'Coordinate with vendors and contractors',
          'Manage inventory and equipment procurement',
          'Conduct safety inspections and training',
        ],
      },
      {
        id: 'exp2',
        company: 'City Housing Authority',
        position: 'Maintenance Technician',
        startDate: '2018-01',
        endDate: '2020-02',
        isCurrent: false,
        description:
          'Performed routine maintenance and repairs on public housing units. Specialized in plumbing, electrical, and HVAC systems.',
        responsibilities: [
          'Responded to maintenance requests within 24 hours',
          'Maintained accurate work order documentation',
          'Collaborated with residents to schedule repairs',
        ],
      },
    ],
  },
  {
    id: 'user2',
    name: 'Jim Green',
    address: 'London No. 1 Lake Park',
    age: 34,
    status: 'ACTIVE',
    tags: ['Logistics'],
    jobTitle: 'Logistics Coordinator',
    jobCategory: 'OPERATIONS',
    yearsExperience: 8,
    bio: 'Ops-minded coordinator.',
    description: 'Focus on route planning and inventory accuracy.',
    workExperience: [
      {
        id: 'exp3',
        company: 'Global Supply Chain Ltd.',
        position: 'Senior Logistics Coordinator',
        startDate: '2019-06',
        endDate: null,
        isCurrent: true,
        description:
          'Oversee logistics operations for international shipping routes. Manage relationships with carriers and optimize delivery schedules.',
        responsibilities: [
          'Coordinate shipments across 15+ countries',
          'Optimize route planning using advanced software',
          'Negotiate contracts with shipping partners',
          'Monitor KPIs and improve delivery times',
        ],
      },
      {
        id: 'exp4',
        company: 'Regional Transport Co.',
        position: 'Logistics Assistant',
        startDate: '2016-09',
        endDate: '2019-05',
        isCurrent: false,
        description:
          'Supported logistics operations for regional deliveries. Maintained inventory tracking systems and coordinated with drivers.',
        responsibilities: [
          'Processed shipping documentation',
          'Tracked inventory levels and reorder points',
          'Coordinated with warehouse staff',
        ],
      },
    ],
  },
  {
    id: 'user3',
    name: 'Joe Black',
    address: 'Sidney No. 1 Lake Park',
    age: 32,
    status: 'ARCHIVED',
    tags: ['Handyman', 'Laundry'],
    jobTitle: 'Handyman',
    jobCategory: 'MAINTENANCE',
    yearsExperience: 5,
    bio: 'All-around fixer.',
    description: 'Handles general repairs and laundry equipment upkeep.',
    workExperience: [
      {
        id: 'exp5',
        company: 'Residential Services Plus',
        position: 'General Handyman',
        startDate: '2019-01',
        endDate: '2024-08',
        isCurrent: false,
        description:
          'Provided comprehensive handyman services for residential properties. Specialized in small repairs, installations, and maintenance tasks.',
        responsibilities: [
          'Performed carpentry, plumbing, and electrical repairs',
          'Installed fixtures and appliances',
          'Maintained laundry equipment in apartment complexes',
          'Provided excellent customer service to tenants',
        ],
      },
    ],
  },
] as const;

const parseYYYYMM = (ym: string | null) =>
  ym ? new Date(`${ym}-01T00:00:00.000Z`) : null;

const toStatus = (s: string): UserStatus =>
  s === 'ARCHIVED' ? UserStatus.ARCHIVED : UserStatus.ACTIVE;

const toJobCategory = (c: string | null | undefined): JobCategory | null => {
  if (!c) return null;
  if (c === 'MAINTENANCE') return JobCategory.MAINTENANCE;
  if (c === 'OPERATIONS') return JobCategory.OPERATIONS;
  return JobCategory.OTHER;
};

async function run() {
  for (const u of seed) {
    // Ensure tags exist and collect IDs
    const tagIds: string[] = [];
    for (const name of u.tags ?? []) {
      const tag = await prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name },
      });
      tagIds.push(tag.id);
    }

    // Upsert user by id
    const user = await prisma.user.upsert({
      where: { id: u.id },
      update: {
        name: u.name,
        address: u.address ?? null,
        age: u.age ?? null,
        status: toStatus(u.status),
        jobTitle: u.jobTitle ?? null,
        jobCategory: toJobCategory(u.jobCategory) ?? null,
        yearsExperience: u.yearsExperience ?? null,
        bio: u.bio ?? null,
        description: u.description ?? null,
        // connect tags (disconnect not handled here to keep seed idempotent-ish)
        tags: { set: [], connect: tagIds.map((id) => ({ id })) },
      },
      create: {
        id: u.id,
        name: u.name,
        address: u.address ?? null,
        age: u.age ?? null,
        status: toStatus(u.status),
        jobTitle: u.jobTitle ?? null,
        jobCategory: toJobCategory(u.jobCategory) ?? null,
        yearsExperience: u.yearsExperience ?? null,
        bio: u.bio ?? null,
        description: u.description ?? null,
        tags: { connect: tagIds.map((id) => ({ id })) },
      },
    });

    // Replace work experiences (simple approach for seed)
    const existingWX = await prisma.workExperience.findMany({
      where: { userId: user.id },
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

    for (const wx of u.workExperience ?? []) {
      const createdWX = await prisma.workExperience.create({
        data: {
          id: wx.id,
          userId: user.id,
          company: wx.company,
          position: wx.position,
          startDate: parseYYYYMM(wx.startDate)!,
          endDate: parseYYYYMM(wx.endDate),
          isCurrent: !!wx.isCurrent,
          description: wx.description ?? null,
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

run()
  .then(async () => {
    await prisma.$disconnect();
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });
