import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import type { JobCategory } from './types';

const API_BASE = 'http://localhost:3000/api';

export default function useGetAllJobCategories() {
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/job-categories`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setJobCategories(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch job categories';
      setError(errorMessage);
      message.error(errorMessage);
      console.error('Error fetching job categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchJobCategories();
  }, [fetchJobCategories]);

  useEffect(() => {
    fetchJobCategories();
  }, [fetchJobCategories]);

  return {
    jobCategories,
    loading,
    error,
    refetch
  };
}