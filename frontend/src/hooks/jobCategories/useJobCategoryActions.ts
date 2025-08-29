import { useState } from 'react';
import { message } from 'antd';
import type { JobCategory } from './types';

const API_BASE = 'http://localhost:3000/api';

export default function useJobCategoryActions() {
  const [loading, setLoading] = useState(false);

  const archiveJobCategory = async (id: string): Promise<JobCategory> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/job-categories/${id}/archive`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
      }

      const updatedJobCategory = await response.json();
      message.success('Job category archived successfully!');
      return updatedJobCategory;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to archive job category';
      message.error(errorMessage);
      console.error('Error archiving job category:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const activateJobCategory = async (id: string): Promise<JobCategory> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/job-categories/${id}/activate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
      }

      const updatedJobCategory = await response.json();
      message.success('Job category activated successfully!');
      return updatedJobCategory;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to activate job category';
      message.error(errorMessage);
      console.error('Error activating job category:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteJobCategory = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/job-categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
      }

      message.success('Job category deleted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete job category';
      message.error(errorMessage);
      console.error('Error deleting job category:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    archiveJobCategory,
    activateJobCategory,
    deleteJobCategory,
    loading
  };
}