"use client";

import { useState, type ChangeEvent } from "react";

interface UseAdminEditNameActionParams {
  currentName: string;
  onSave: (name: string) => void | Promise<unknown>;
}

export function useAdminEditNameAction({
  currentName,
  onSave,
}: UseAdminEditNameActionParams) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(currentName);

  const openDialog = () => {
    setName(currentName);
    setOpen(true);
  };

  const close = () => {
    if (loading) return;
    setOpen(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) close();
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const run = async () => {
    const next = name.trim();
    if (!next || next === currentName.trim()) return;
    setLoading(true);
    try {
      await onSave(next);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const canSave = Boolean(name.trim()) && name.trim() !== currentName.trim();

  return {
    open,
    loading,
    name,
    canSave,
    openDialog,
    close,
    handleOpenChange,
    handleNameChange,
    run,
  };
}
