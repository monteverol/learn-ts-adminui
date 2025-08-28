import { Request, Response } from 'express';
import { JobCategoryService } from './job-category.service.js';

const mockJobCategories = [
  {
    key: "1",
    name: "Plumbing",
    description: "Water pipes, drainage, and fixture repairs",
    status: "Active",
    jobsCount: 245,
    avgPrice: 85,
    tags: ["urgent", "licensed", "residential"],
    icon: "🔧",
    color: "#1890ff",
    createdAt: "2024-01-15T00:00:00.000Z"
  },
  {
    key: "2",
    name: "Electrical",
    description: "Electrical installations and repairs",
    status: "Active",
    jobsCount: 189,
    avgPrice: 120,
    tags: ["certified", "emergency", "commercial"],
    icon: "⚡",
    color: "#faad14",
    createdAt: "2024-01-10T00:00:00.000Z"
  },
  {
    key: "3",
    name: "House Cleaning",
    description: "Professional house and office cleaning services",
    status: "Active",
    jobsCount: 456,
    avgPrice: 65,
    tags: ["regular", "deep-clean", "eco-friendly"],
    icon: "🏠",
    color: "#52c41a",
    createdAt: "2024-01-08T00:00:00.000Z"
  },
  {
    key: "4",
    name: "Painting",
    description: "Interior and exterior painting services",
    status: "Archived",
    jobsCount: 78,
    avgPrice: 95,
    tags: ["interior", "exterior", "commercial"],
    icon: "🎨",
    color: "#722ed1",
    createdAt: "2024-01-05T00:00:00.000Z"
  },
  {
    key: "5",
    name: "Moving Services",
    description: "Relocation and moving assistance",
    status: "Active",
    jobsCount: 134,
    avgPrice: 150,
    tags: ["local", "long-distance", "packing"],
    icon: "🚛",
    color: "#eb2f96",
    createdAt: "2024-01-01T00:00:00.000Z"
  }
];

export const create = async (req: Request, res: Response) => {
  const jobCategory = await JobCategoryService.create(req.body);
  res.status(201).json(jobCategory);
};

export const list = async (_req: Request, res: Response) => {
  const jobCategories = await JobCategoryService.findAll();
  res.json(jobCategories);
};

export const getById = async (req: Request, res: Response) => {
  const jobCategory = await JobCategoryService.findById(req.params.id);
  if (!jobCategory) return res.status(404).json({ error: 'NotFound' });
  res.json(jobCategory);
};

export const update = async (req: Request, res: Response) => {
  const jobCategory = await JobCategoryService.update(req.params.id, req.body);
  res.json(jobCategory);
};

export const remove = async (req: Request, res: Response) => {
  await JobCategoryService.softDelete(req.params.id);
  res.status(204).end();
};