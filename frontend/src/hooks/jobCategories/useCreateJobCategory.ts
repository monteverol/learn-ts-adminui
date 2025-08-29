import { useState } from 'react';
import { message } from 'antd';
import type { JobCategory, CreateJobCategoryData } from './types';

const API_BASE = 'http://localhost:3000/api';

export default function useCreateJobCategory() {
  const [loading, setLoading] = useState(false);

  const createJobCategory = async (data: CreateJobCategoryData): Promise<JobCategory> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/job-categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
      }

      const newJobCategory = await response.json();
      message.success('Job category created successfully!');
      return newJobCategory;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create job category';
      message.error(errorMessage);
      console.error('Error creating job category:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createJobCategory,
    loading
  };
}