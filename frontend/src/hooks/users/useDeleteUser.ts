import { useState } from 'react';
import { message } from 'antd';

const API_BASE = 'http://localhost:3000/api';

export default function useDeleteUser() {
  const [loading, setLoading] = useState(false);

  const deleteUser = async (userId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      message.success('User deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error(error instanceof Error ? error.message : 'Failed to delete user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading };
}