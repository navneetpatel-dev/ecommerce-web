"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { USER_STATUS } from "@/shared/constants/statuses";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { Button } from "@/shared/components/ui/button";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { adminUsersApi } from "../../api/users/users.api.hook";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import { adminRowLabel } from "../../utils/shared/adminRowLabel";
import { isSelfAdminTarget } from "../../utils/shared/isSelfAdminTarget";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";
import type { AdminListPageModel } from "../../types/shared/adminListPage.types";
import type { AdminUsersFiltersProps } from "../../components/users/AdminUsersFilters.component";

export type AdminUsersPageModel = AdminListPageModel & {
  filters: AdminUsersFiltersProps;
};

export function useAdminUsersPage(): AdminUsersPageModel {
  const currentUserId = useAuthStore((s) => s.currentUser?.id);
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
      // Backend rejects a status change or delete an admin targets at their own account
      // (self-escalation guard) — hide those actions here rather than let the admin hit a
      // confusing 403.
      const isSelf = isSelfAdminTarget(row.id, currentUserId);

      return (
        <>
          <Button
            size="sm"
            variant="outline"
            className={tableMenuButtonClass("neutral")}
            asChild
          >
            <Link href={`/admin/users/${row.id}`}>
              <Eye strokeWidth={2.25} aria-hidden />
              <span>{LABELS.view}</span>
            </Link>
          </Button>
          {isSelf ? null : (
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
          )}
          {isSelf ? null : (
            <AdminConfirmAction
              label={LABELS.delete}
              dialogVariant="danger"
              title={LABELS.confirmDeleteUserTitle}
              description={formatLabel(LABELS.confirmDeleteUserBody, { name })}
              onConfirm={() =>
                adminUsersApi.delete(String(row.id)).then(reload)
              }
            />
          )}
        </>
      );
    },
    [currentUserId],
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
