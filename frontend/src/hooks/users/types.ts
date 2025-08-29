export interface Tag {
  id: string;
  name: string;
}

export interface Responsibility {
  id: string;
  title: string;
  workExperienceId: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  responsibilities: Responsibility[];
}

export interface User {
  id: string;
  name: string;
  age?: number;
  address?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  jobTitle?: string;
  jobCategory?: 'MAINTENANCE' | 'OPERATIONS' | 'OTHER';
  yearsExperience?: number;
  bio?: string;
  description?: string;
  tags: Tag[];
  workExperience: WorkExperience[];
  createdAt: string;
  updatedAt: string;
}