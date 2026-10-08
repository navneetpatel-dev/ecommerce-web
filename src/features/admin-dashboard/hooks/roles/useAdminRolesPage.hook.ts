"use client";

import { useCallback, useEffect, useState } from "react";
import {
  rolesApi,
  type AdminRole,
  type AdminPermission,
} from "../../api/roles/roles.api";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";

export function useAdminRolesPage() {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  const load = useCallback(() => {
    Promise.all([rolesApi.list(), rolesApi.listPermissions()])
      .then(([roleRows, permissionRows]) => {
        setRoles(roleRows);
        setPermissions(permissionRows);
      })
      .catch((err) =>
        setError(getApiErrorMessage(err, LABELS.couldNotLoadData)),
      )
      .finally(() => setLoading(false));
  }, []);

  const reload = () => {
    setLoading(true);
    setError(null);
    load();
  };

  useEffect(() => {
    load();
  }, [load]);

  const createRole = async () => {
    if (!newRoleName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      await rolesApi.create(newRoleName.trim());
      setNewRoleName("");
      reload();
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotCreateRole));
    } finally {
      setCreating(false);
    }
  };

  const deleteRole = async (id: string) => {
    setError(null);
    try {
      await rolesApi.delete(id);
      reload();
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotDeleteRole));
    }
  };

  const savePermissions = async (id: string, permissionKeys: string[]) => {
    await rolesApi.setPermissions(id, permissionKeys);
    reload();
    setEditingRoleId(null);
  };

  const editingRole = roles.find((r) => r.id === editingRoleId) ?? null;

  return {
    roles,
    permissions,
    loading,
    error,
    newRoleName,
    setNewRoleName,
    creating,
    createRole,
    deleteRole,
    editingRoleId,
    editingRole,
    setEditingRoleId,
    savePermissions,
  };
}
