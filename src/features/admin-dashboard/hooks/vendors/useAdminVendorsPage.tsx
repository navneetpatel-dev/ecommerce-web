"use client";

import { useCallback } from "react";
import {
  PERMISSIONS,
  type PermissionKey,
} from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { adminApi } from "../../api/analytics/admin.api";
import { usePendingVendors } from "../../api/analytics/admin.queries";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { renderVendorRowActions } from "../../components/vendors/VendorRowActions.component";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";
import type { AdminListPageModel } from "../../types/shared/adminListPage.types";

export type AdminVendorsPageModel = AdminListPageModel & {
  gatePermission: PermissionKey[];
  showApprovalQueue: boolean;
  pendingCount: number;
};

export function useAdminVendorsPage(): AdminVendorsPageModel {
  const { hasPermission } = usePermissions();
  const { data: pendingVendors } = usePendingVendors();

  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) =>
      adminApi.vendors({ page, limit }),
    [],
  );

  const actions = useCallback((row: AdminDataRow, reload: () => void) => {
    return renderVendorRowActions({ row, onReload: reload });
  }, []);

  return {
    gatePermission: [PERMISSIONS.VENDOR_MANAGE, PERMISSIONS.VENDOR_APPROVE],
    title: LABELS.vendors,
    permission: PERMISSIONS.VENDOR_MANAGE,
    load,
    actions,
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
  };
}
