import { useState } from 'react';
import { message } from 'antd';

const API_BASE = 'http://localhost:3000/api';

interface CreateUserData {
  name: string;
  age?: number;
  address?: string;
  status: string;
  tags?: string[];
  jobTitle?: string;
  jobCategory?: string;
  yearsExperience?: number;
  bio?: string;
  description?: string;
  workExperience?: any[];
}

export default function useCreateUser() {
  const [loading, setLoading] = useState(false);

  const createUser = async (userData: CreateUserData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const newUser = await response.json();
      message.success('User created successfully!');
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      message.error(error instanceof Error ? error.message : 'Failed to create user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading };
}