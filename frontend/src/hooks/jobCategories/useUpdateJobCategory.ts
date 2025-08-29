import { useState } from 'react';
import { message } from 'antd';
import type { JobCategory, UpdateJobCategoryData } from './types';

const API_BASE = 'http://localhost:3000/api';

export default function useUpdateJobCategory() {
  const [loading, setLoading] = useState(false);

  const updateJobCategory = async (id: string, data: UpdateJobCategoryData): Promise<JobCategory> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/job-categories/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
      }

      const updatedJobCategory = await response.json();
      message.success('Job category updated successfully!');
      return updatedJobCategory;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update job category';
      message.error(errorMessage);
      console.error('Error updating job category:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateJobCategory,
    loading
  };
}