"use client";

import { useCallback, type ReactNode } from "react";
import {
  PERMISSIONS,
  type PermissionKey,
} from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { productsApi } from "@/features/products";
import { adminApi } from "../../api/analytics/admin.api";
import { usePendingProducts } from "../../api/analytics/admin.queries";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import { adminRowLabel } from "../../utils/shared/adminRowLabel";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";
import type { AdminListPageModel } from "../../types/shared/adminListPage.types";

export type AdminProductsPageModel = AdminListPageModel & {
  approvePermission: PermissionKey;
  showApprovalQueue: boolean;
  pendingCount: number;
};

export function useAdminProductsPage(): AdminProductsPageModel {
  const { hasPermission } = usePermissions();
  const { data: pendingProducts } = usePendingProducts();

  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) =>
      productsApi.list({ page, limit }),
    [],
  );

  const actions = useCallback(
    (row: AdminDataRow, reload: () => void): ReactNode => {
      const name = adminRowLabel(row);
      const isArchived = row.status === "ARCHIVED";

      if (isArchived) {
        return (
          <AdminConfirmAction
            label="Reactivate"
            dialogVariant="info"
            tone="success"
            title="Reactivate Product"
            description={`Are you sure you want to restore "${name || "this product"}" to active status?`}
            onConfirm={() =>
              adminApi.unarchiveProduct(String(row.id)).then(reload)
            }
          />
        );
      }

      return (
        <AdminConfirmAction
          label={LABELS.archive}
          dialogVariant="warning"
          tone="archive"
          title={LABELS.confirmArchiveProductTitle}
          description={formatLabel(LABELS.confirmArchiveProductBody, { name })}
          onConfirm={() => adminApi.archiveProduct(String(row.id)).then(reload)}
        />
      );
    },
    [],
  );

  return {
    approvePermission: PERMISSIONS.PRODUCT_APPROVE,
    title: LABELS.products,
    permission: PERMISSIONS.PRODUCT_MANAGE,
    load,
    actions,
    columnKeys: ["name", "vendorName", "categoryName", "status", "basePrice"],
    showApprovalQueue: hasPermission(PERMISSIONS.PRODUCT_APPROVE),
    pendingCount: pendingProducts?.total ?? 0,
  };
}
