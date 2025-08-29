import { useState } from 'react';
import { message } from 'antd';

const API_BASE = 'http://localhost:3000/api';

interface UpdateUserData {
  name?: string;
  age?: number;
  address?: string;
  status?: 'ACTIVE' | 'ARCHIVED';
  tags?: string[];
  jobTitle?: string;
  jobCategory?: 'MAINTENANCE' | 'OPERATIONS' | 'OTHER';
  yearsExperience?: number;
  bio?: string;
  description?: string;
  workExperience?: any[];
}

export default function useUpdateUser() {
  const [loading, setLoading] = useState(false);

  const updateUser = async (userId: string, userData: UpdateUserData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error response:', errorData);
        
        // Handle validation errors specially
        if (response.status === 400 && errorData.details) {
          const validationMessages = errorData.details.map((detail: any) => 
            `${detail.path}: ${detail.message}`
          ).join(', ');
          throw new Error(`Validation failed: ${validationMessages}`);
        }
        
        throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
      }

      const updatedUser = await response.json();
      message.success('User updated successfully!');
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      message.error(error instanceof Error ? error.message : 'Failed to update user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading };
}