import { useState, useEffect } from 'react';
import { message } from 'antd';

const API_BASE = 'http://localhost:3000/api';

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

export default function useGetUser(userId: string | undefined) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/users/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user';
      setError(errorMessage);
      message.error(errorMessage);
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    if (userId) {
      fetchUser(userId);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    } else {
      setUser(null);
      setError(null);
    }
  }, [userId]);

  return {
    user,
    loading,
    error,
    refetch
  };
}