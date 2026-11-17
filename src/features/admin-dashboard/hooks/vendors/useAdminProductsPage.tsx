"use client";

import { useCallback, useState, type ReactNode } from "react";
import {
  PERMISSIONS,
  type PermissionKey,
} from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { productsApi } from "@/features/products";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { adminApi } from "../../api/analytics/admin.api";
import { usePendingProducts } from "../../api/analytics/admin.queries";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import { adminRowLabel } from "../../utils/shared/adminRowLabel";
import type { AdminProductsFiltersProps } from "../../components/vendors/AdminProductsFilters.component";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";
import type { AdminListPageModel } from "../../types/shared/adminListPage.types";

export type AdminProductsPageModel = AdminListPageModel & {
  approvePermission: PermissionKey;
  showApprovalQueue: boolean;
  pendingCount: number;
  filters: AdminProductsFiltersProps;
};

export function useAdminProductsPage(): AdminProductsPageModel {
  const { hasPermission } = usePermissions();
  const { data: pendingProducts } = usePendingProducts();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) =>
      productsApi.list({
        page,
        limit,
        search: debouncedSearch || undefined,
        status: status || undefined,
      }),
    [debouncedSearch, status],
  );

  const onClear = useCallback(() => {
    setSearch("");
    setStatus("");
  }, []);

  const actions = useCallback(
    (row: AdminDataRow, reload: () => void): ReactNode => {
      const name = adminRowLabel(row);
      const isArchived = row.status === "ARCHIVED";
      const reactivateProduct = () =>
        adminApi.unarchiveProduct(String(row.id)).then(reload);
      const archiveProduct = () =>
        adminApi.archiveProduct(String(row.id)).then(reload);

      if (isArchived) {
        return (
          <AdminConfirmAction
            label={LABELS.reactivateProduct}
            dialogVariant="info"
            tone="success"
            title={LABELS.confirmReactivateProductTitle}
            description={formatLabel(LABELS.confirmReactivateProductBody, {
              name: name || LABELS.thisItem,
            })}
            onConfirm={reactivateProduct}
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
          onConfirm={archiveProduct}
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
    filters: {
      search,
      status,
      onSearchChange: setSearch,
      onStatusChange: setStatus,
      onClear,
    },
  };
}
