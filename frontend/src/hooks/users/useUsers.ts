// Legacy compatibility hook - DEPRECATED
// This hook provides backward compatibility for existing components
// that still use the old useUsers pattern. New code should use useGetUser or useGetAllUsers directly.

import useGetAllUsers from './useGetAllUsers';

interface Tag {
  id: string;
  name: string;
}

interface User {
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
  workExperience: any[];
  createdAt: string;
  updatedAt: string;
}

export function useUsers() {
  const { users, loading, error } = useGetAllUsers();

  // Legacy getByKey method for backward compatibility
  const getByKey = (id: string | undefined): User | undefined => {
    if (!id || !users) return undefined;
    return users.find(user => user.id === id);
  };

  return {
    users: users || [],
    loading,
    error,
    getByKey
  };
}