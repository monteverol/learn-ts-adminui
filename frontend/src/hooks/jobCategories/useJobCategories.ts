import { useMemo } from 'react';
import useGetAllJobCategories from './useGetAllJobCategories';
import useCreateJobCategory from './useCreateJobCategory';
import useUpdateJobCategory from './useUpdateJobCategory';
import useJobCategoryActions from './useJobCategoryActions';
import type { JobCategory, CreateJobCategoryData, UpdateJobCategoryData } from './types';

export function useJobCategories() {
  const { jobCategories, loading: fetchLoading, error, refetch } = useGetAllJobCategories();
  const { createJobCategory, loading: createLoading } = useCreateJobCategory();
  const { updateJobCategory, loading: updateLoading } = useUpdateJobCategory();
  const { archiveJobCategory, activateJobCategory, loading: actionLoading } = useJobCategoryActions();

  // Convert backend data to frontend format for compatibility
  const formattedJobCategories = useMemo(() => {
    return jobCategories.map((category) => ({
      key: category.id,
      id: category.id,
      name: category.name,
      description: category.description,
      status: category.status === 'ACTIVE' ? 'Active' : 'Archived',
      jobsCount: category.jobsCount,
      avgPrice: category.avgPrice,
      icon: category.icon,
      color: category.color,
      tags: category.tags?.map(tag => tag.name) || [],
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));
  }, [jobCategories]);

  const isMutating = createLoading || updateLoading || actionLoading;

  const handleCreateJobCategory = async (data: CreateJobCategoryData) => {
    await createJobCategory(data);
    refetch(); // Refresh the list
  };

  const handleUpdateJobCategory = async (id: string, data: UpdateJobCategoryData) => {
    await updateJobCategory(id, data);
    refetch(); // Refresh the list
  };

  const changeStatus = async (id: string, newStatus: string) => {
    if (newStatus === 'Active') {
      await activateJobCategory(id);
    } else {
      await archiveJobCategory(id);
    }
    refetch(); // Refresh the list
  };

  const getByKey = (key: string | undefined) => {
    if (!key) return undefined;
    return formattedJobCategories.find(category => category.key === key);
  };

  return {
    jobCategories: formattedJobCategories,
    loading: fetchLoading,
    error,
    isMutating,
    createJobCategory: handleCreateJobCategory,
    updateJobCategory: handleUpdateJobCategory,
    changeStatus,
    getByKey,
    refetch
  };
}