"use client";

import { useEffect, useMemo, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type { AdminRole, AdminPermission } from "../../../api/roles/roles.api";

interface UseRolePermissionsDialogParams {
  role: AdminRole | null;
  permissions: AdminPermission[];
  onClose: () => void;
  onSave: (roleId: string, permissionKeys: string[]) => Promise<void>;
}

export function useRolePermissionsDialog({
  role,
  permissions,
  onClose,
  onSave,
}: UseRolePermissionsDialogParams) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelected(new Set(role?.permissionKeys ?? []));
    setSearch("");
    setError(null);
  }, [role]);

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filteredPermissions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return permissions;
    return permissions.filter((p) => {
      const mod = p.key.split(".")[0]?.toLowerCase() ?? "";
      return p.key.toLowerCase().includes(q) || mod.includes(q);
    });
  }, [permissions, search]);

  const selectVisible = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      filteredPermissions.forEach((p) => next.add(p.key));
      return next;
    });
  };

  const clearVisible = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      filteredPermissions.forEach((p) => next.delete(p.key));
      return next;
    });
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) onClose();
  };

  const handleResetSearch = () => {
    setSearch("");
  };

  const submit = async () => {
    if (!role) return;
    setSaving(true);
    setError(null);
    try {
      await onSave(role.id, [...selected]);
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadData));
    } finally {
      setSaving(false);
    }
  };

  return {
    selected,
    search,
    setSearch,
    saving,
    error,
    filteredPermissions,
    toggle,
    selectVisible,
    clearVisible,
    handleOpenChange,
    handleResetSearch,
    submit,
  };
}
