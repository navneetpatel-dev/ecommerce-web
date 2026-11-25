"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { useUrlFilterParams } from "@/shared/hooks/navigation/useUrlFilterParams.hook";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { adminUsersApi } from "../../api/users/users.api.hook";
import { AdminUserRowActions } from "../../components/users/AdminUserRowActions.component";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";
import type { AdminListPageModel } from "../../types/shared/adminListPage.types";
import type { AdminUsersFiltersProps } from "../../components/users/AdminUsersFilters.component";

export type AdminUsersPageModel = AdminListPageModel & {
  filters: AdminUsersFiltersProps;
};

export function useAdminUsersPage(): AdminUsersPageModel {
  const currentUserId = useAuthStore((s) => s.currentUser?.id);
  const urlFilters = useUrlFilterParams<"search" | "status" | "roleId">({
    search: ["q"],
    roleId: ["role"],
  });
  const search = urlFilters.get("search");
  const status = urlFilters.get("status");
  const roleId = urlFilters.get("roleId");
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  useEffect(() => {
    adminUsersApi
      .listRoles()
      .then(setRoles)
      .catch(() => setRoles([]));
  }, []);

  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) =>
      adminUsersApi.list({
        page,
        limit,
        search: debouncedSearch || undefined,
        status: status || undefined,
        roleId: roleId || undefined,
      }),
    [debouncedSearch, status, roleId],
  );

  const onClear = useCallback(() => {
    urlFilters.clearAll(["search", "status", "roleId"]);
  }, [urlFilters]);

  const actions = useCallback(
    (row: AdminDataRow, reload: () => void): ReactNode => (
      <AdminUserRowActions
        row={row}
        reload={reload}
        currentUserId={currentUserId}
      />
    ),
    [currentUserId],
  );

  const fetchDetail = useCallback(
    async (row: AdminDataRow) =>
      (await adminUsersApi.getById(String(row.id))) as unknown as Record<
        string,
        unknown
      >,
    [],
  );

  return {
    title: LABELS.users,
    permission: PERMISSIONS.USER_MANAGE,
    load,
    actions,
    fetchDetail,
    columnKeys: ["name", "email", "status", "role"],
    filters: {
      search,
      status,
      roleId,
      roles,
      onSearchChange: urlFilters.set("search"),
      onStatusChange: urlFilters.set("status"),
      onRoleIdChange: urlFilters.set("roleId"),
      onClear,
    },
  };
}
