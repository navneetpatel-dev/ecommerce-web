"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { USER_STATUS } from "@/shared/constants/statuses";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { Button } from "@/shared/components/ui/button";
import { useDebouncedValue } from "@/shared/hooks/use-debounce.hook";
import { adminUsersApi } from "../api/users.api.hook";
import { AdminConfirmAction } from "../components/AdminConfirmAction.component";
import { adminRowLabel } from "../utils/adminRowLabel";
import type { AdminDataRow } from "./useAdminDataList.hook";
import type { AdminListPageModel } from "../types/adminListPage.types";
import type { AdminUsersFiltersProps } from "../components/AdminUsersFilters.component";

export type AdminUsersPageModel = AdminListPageModel & {
  filters: AdminUsersFiltersProps;
};

export function useAdminUsersPage(): AdminUsersPageModel {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [roleId, setRoleId] = useState("");
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
    setSearch("");
    setStatus("");
    setRoleId("");
  }, []);

  const actions = useCallback(
    (row: AdminDataRow, reload: () => void): ReactNode => {
      const name = adminRowLabel(row);
      const isBlocked = row.status === USER_STATUS.BLOCKED;

      return (
        <>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/admin/users/${row.id}`}>{LABELS.view}</Link>
          </Button>
          <AdminConfirmAction
            label={isBlocked ? LABELS.activate : LABELS.block}
            dialogVariant={isBlocked ? "success" : "warning"}
            tone={isBlocked ? "success" : "neutral"}
            title={
              isBlocked
                ? LABELS.confirmActivateUserTitle
                : LABELS.confirmBlockUserTitle
            }
            description={formatLabel(
              isBlocked
                ? LABELS.confirmActivateUserBody
                : LABELS.confirmBlockUserBody,
              { name },
            )}
            onConfirm={() =>
              adminUsersApi
                .updateStatus(
                  String(row.id),
                  isBlocked ? USER_STATUS.ACTIVE : USER_STATUS.BLOCKED,
                )
                .then(reload)
            }
          />
          <AdminConfirmAction
            label={LABELS.delete}
            dialogVariant="danger"
            title={LABELS.confirmDeleteUserTitle}
            description={formatLabel(LABELS.confirmDeleteUserBody, { name })}
            onConfirm={() => adminUsersApi.delete(String(row.id)).then(reload)}
          />
        </>
      );
    },
    [],
  );

  return {
    title: LABELS.users,
    permission: PERMISSIONS.USER_MANAGE,
    load,
    actions,
    columnKeys: ["name", "email", "status", "role"],
    filters: {
      search,
      status,
      roleId,
      roles,
      onSearchChange: setSearch,
      onStatusChange: setStatus,
      onRoleIdChange: setRoleId,
      onClear,
    },
  };
}
