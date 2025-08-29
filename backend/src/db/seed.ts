import { prisma } from './client.js';
import { UserStatus, JobCategoryType, JobCategoryStatus } from '@prisma/client';

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

const toJobCategory = (c: string | null | undefined): JobCategoryType | null => {
  if (!c) return null;
  if (c === 'MAINTENANCE') return JobCategoryType.MAINTENANCE;
  if (c === 'OPERATIONS') return JobCategoryType.OPERATIONS;
  return JobCategoryType.OTHER;
};

const jobCategories = [
  {
    id: "jc1",
    name: "Plumbing",
    description: "Water pipes, drainage, and fixture repairs",
    status: "ACTIVE",
    jobsCount: 245,
    avgPrice: 85,
    tags: ["urgent", "licensed", "residential"],
    icon: "🔧",
    color: "#1890ff",
    createdAt: "2024-01-15T00:00:00.000Z"
  },
  {
    id: "jc2",
    name: "Electrical",
    description: "Electrical installations and repairs",
    status: "ACTIVE",
    jobsCount: 189,
    avgPrice: 120,
    tags: ["certified", "emergency", "commercial"],
    icon: "⚡",
    color: "#faad14",
    createdAt: "2024-01-10T00:00:00.000Z"
  },
  {
    id: "jc3",
    name: "House Cleaning",
    description: "Professional house and office cleaning services",
    status: "ACTIVE",
    jobsCount: 456,
    avgPrice: 65,
    tags: ["regular", "deep-clean", "eco-friendly"],
    icon: "🏠",
    color: "#52c41a",
    createdAt: "2024-01-08T00:00:00.000Z"
  },
  {
    id: "jc4",
    name: "Painting",
    description: "Interior and exterior painting services",
    status: "ARCHIVED",
    jobsCount: 78,
    avgPrice: 95,
    tags: ["interior", "exterior", "commercial"],
    icon: "🎨",
    color: "#722ed1",
    createdAt: "2024-01-05T00:00:00.000Z"
  },
  {
    id: "jc5",
    name: "Moving Services",
    description: "Relocation and moving assistance",
    status: "ACTIVE",
    jobsCount: 134,
    avgPrice: 150,
    tags: ["local", "long-distance", "packing"],
    icon: "🚛",
    color: "#eb2f96",
    createdAt: "2024-01-01T00:00:00.000Z"
  }
] as const;

const toJobCategoryStatus = (s: string): JobCategoryStatus =>
  s === 'ARCHIVED' ? JobCategoryStatus.ARCHIVED : JobCategoryStatus.ACTIVE;

async function run() {
  // Seed job categories first
  for (const jc of jobCategories) {
    // Upsert job category by id
    const jobCategory = await prisma.jobCategory.upsert({
      where: { id: jc.id },
      update: {
        name: jc.name,
        description: jc.description,
        status: toJobCategoryStatus(jc.status),
        jobsCount: jc.jobsCount,
        avgPrice: jc.avgPrice,
        icon: jc.icon,
        color: jc.color,
      },
      create: {
        id: jc.id,
        name: jc.name,
        description: jc.description,
        status: toJobCategoryStatus(jc.status),
        jobsCount: jc.jobsCount,
        avgPrice: jc.avgPrice,
        icon: jc.icon,
        color: jc.color,
        createdAt: new Date(jc.createdAt),
      },
    });

    // Replace job category tags (simple approach for seed)
    const existingTags = await prisma.jobCategoryTag.findMany({
      where: { jobCategoryId: jobCategory.id },
      select: { id: true },
    });
    if (existingTags.length) {
      await prisma.jobCategoryTag.deleteMany({
        where: { id: { in: existingTags.map((t) => t.id) } },
      });
    }

    // Add tags
    if (jc.tags?.length) {
      await prisma.jobCategoryTag.createMany({
        data: jc.tags.map((tagName: string) => ({
          name: tagName,
          jobCategoryId: jobCategory.id,
        })),
      });
    }
  }

  // Seed users
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
