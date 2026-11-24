"use client";

import type { ReactNode } from "react";
import { useCallback } from "react";
import { RequirePermission } from "@/shared/components/system/RequirePermission.component";
import type { PermissionKey } from "@/shared/constants/permissions/permissions";
import {
  useAdminDataList,
  type AdminDataRow,
  type AdminListLoadFn,
} from "../../hooks/shared/useAdminDataList.hook";
import { AdminDataListView } from "../../components/shared/AdminDataListView.component";

interface AdminDataPageProps {
  title: string;
  permission: PermissionKey | PermissionKey[];
  load: AdminListLoadFn;
  actions?: (row: AdminDataRow, reload: () => void) => ReactNode;
  columnKeys?: string[];
  /** Hide the list title when the parent page already provides one (e.g. tabs). */
  hideTitle?: boolean;
  titleLevel?: 1 | 2;
  onRowClick?: (row: AdminDataRow) => void;
  fetchRowDetail?: (row: AdminDataRow) => Promise<Record<string, unknown>>;
}

export function AdminDataPage({
  title,
  permission,
  load,
  actions,
  columnKeys,
  hideTitle = false,
  titleLevel,
  onRowClick,
  fetchRowDetail,
}: AdminDataPageProps) {
  const stableLoad = useCallback<AdminListLoadFn>(
    (params) => load(params),
    [load],
  );
  const list = useAdminDataList(stableLoad);
  const displayTitle = hideTitle ? "" : title;

  return (
    <RequirePermission permission={permission}>
      <AdminDataListView
        title={displayTitle}
        titleLevel={titleLevel}
        rows={list.rows}
        loading={list.loading}
        refreshing={list.refreshing}
        error={list.error}
        onRefresh={list.reload}
        page={list.page}
        totalPages={list.totalPages}
        total={list.total}
        from={list.from}
        to={list.to}
        onPageChange={list.onPageChange}
        actions={actions}
        columnKeys={columnKeys}
        onRowClick={onRowClick}
        fetchRowDetail={fetchRowDetail}
      />
    </RequirePermission>
  );
}
