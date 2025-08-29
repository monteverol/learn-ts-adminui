import { useState, useCallback } from 'react';

export function useJobCategoryModals() {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | undefined>(undefined);

  const openAdd = useCallback(() => {
    setAddOpen(true);
  }, []);

  const closeAdd = useCallback(() => {
    setAddOpen(false);
  }, []);

  const openEdit = useCallback((key: string) => {
    setEditingKey(key);
    setEditOpen(true);
  }, []);

  const closeEdit = useCallback(() => {
    setEditOpen(false);
    setEditingKey(undefined);
  }, []);

  return {
    addOpen,
    editOpen,
    editingKey,
    openAdd,
    closeAdd,
    openEdit,
    closeEdit
  };
}