export interface JobCategoryTag {
  id: string;
  name: string;
  jobCategoryId: string;
}

export interface JobCategory {
  id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  jobsCount: number;
  avgPrice?: number;
  icon?: string;
  color?: string;
  tags: JobCategoryTag[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateJobCategoryData {
  name: string;
  description?: string;
  status?: 'ACTIVE' | 'ARCHIVED';
  jobsCount?: number;
  avgPrice?: number;
  icon?: string;
  color?: string;
  tags?: string[];
}

export interface UpdateJobCategoryData {
  name?: string;
  description?: string;
  status?: 'ACTIVE' | 'ARCHIVED';
  jobsCount?: number;
  avgPrice?: number;
  icon?: string;
  color?: string;
  tags?: string[];
}