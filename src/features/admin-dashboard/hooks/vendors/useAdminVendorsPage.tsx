"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  PERMISSIONS,
  type PermissionKey,
} from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { adminApi } from "../../api/analytics/admin.api";
import { usePendingVendors } from "../../api/analytics/admin.queries";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { vendorsApi } from "@/features/vendors";
import { renderVendorRowActions } from "../../components/vendors/VendorRowActions.component";
import type { AdminVendorsFiltersProps } from "../../components/vendors/AdminVendorsFilters.component";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";
import type { AdminListPageModel } from "../../types/shared/adminListPage.types";

export type AdminVendorsPageModel = AdminListPageModel & {
  gatePermission: PermissionKey[];
  showApprovalQueue: boolean;
  pendingCount: number;
  filters: AdminVendorsFiltersProps;
};

export function useAdminVendorsPage(): AdminVendorsPageModel {
  const { hasPermission } = usePermissions();
  const { data: pendingVendors } = usePendingVendors();
  const searchParams = useSearchParams();
  const paramSearch = searchParams.get("search") ?? searchParams.get("q") ?? "";
  const paramStatus = searchParams.get("status") ?? "";

  const [userSearch, setUserSearch] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(null);

  const search = userSearch ?? paramSearch;
  const status = userStatus ?? paramStatus;
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) =>
      adminApi.vendors({
        page,
        limit,
        search: debouncedSearch || undefined,
        status: status || undefined,
      }),
    [debouncedSearch, status],
  );

  const onClear = useCallback(() => {
    setUserSearch("");
    setUserStatus("");
  }, []);

  const actions = useCallback((row: AdminDataRow, reload: () => void) => {
    return renderVendorRowActions({ row, onReload: reload });
  }, []);

  const fetchDetail = useCallback(
    async (row: AdminDataRow) =>
      (await vendorsApi.getById(String(row.id))) as unknown as Record<
        string,
        unknown
      >,
    [],
  );

  return {
    gatePermission: [PERMISSIONS.VENDOR_MANAGE, PERMISSIONS.VENDOR_APPROVE],
    title: LABELS.vendors,
    permission: [PERMISSIONS.VENDOR_MANAGE, PERMISSIONS.VENDOR_APPROVE],
    load,
    actions,
    fetchDetail,
    columnKeys: [
      "businessName",
      "slug",
      "gstNumber",
      "state",
      "status",
      "rejectionReason",
      "suspensionReason",
    ],
    showApprovalQueue: hasPermission(PERMISSIONS.VENDOR_APPROVE),
    pendingCount: pendingVendors?.total ?? 0,
    filters: {
      search,
      status,
      onSearchChange: setUserSearch,
      onStatusChange: setUserStatus,
      onClear,
    },
  };
}
