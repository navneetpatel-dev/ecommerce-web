"use client";

import { useCallback, useState, type ReactNode } from "react";
import {
  PERMISSIONS,
  type PermissionKey,
} from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { PlatformListedBadge, productsApi } from "@/features/products";
import { usePendingProducts } from "../../api/analytics/admin.queries";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { useAdminProductEditor } from "./useAdminProductEditor.hook";
import { useAdminProductRowActions } from "./useAdminProductRowActions";
import { useProductListFilters } from "./useProductListFilters.hook";
import { AdminProductStatusCell } from "../../components/vendors/AdminProductStatusCell.component";
import type { AdminProductsFiltersProps } from "../../components/vendors/AdminProductsFilters.component";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";
import type { AdminListPageModel } from "../../types/shared/adminListPage.types";

export type AdminProductsPageModel = AdminListPageModel & {
  approvePermission: PermissionKey;
  showApprovalQueue: boolean;
  pendingCount: number;
  filters: AdminProductsFiltersProps;
  cellOverrides: Record<string, (row: AdminDataRow) => ReactNode>;
  editor: ReturnType<typeof useAdminProductEditor>;
};

export function useAdminProductsPage(): AdminProductsPageModel {
  const { hasPermission } = usePermissions();
  const { data: pendingProducts } = usePendingProducts();
  // Bumped after a save so the list reloads.
  const [version, setVersion] = useState(0);
  const bumpVersion = useCallback(() => setVersion((value) => value + 1), []);
  const editor = useAdminProductEditor(bumpVersion);
  const { values, query, handlers } = useProductListFilters();
  const { status } = values;

  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) =>
      productsApi.list({ page, limit, status: status || undefined, ...query }),
    // `version` is bumped after a save: a new `load` makes the list fetch again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, status, version],
  );

  const actions = useAdminProductRowActions(editor);

  const cellOverrides = {
    listedByPlatform: (row: AdminDataRow) =>
      row.listedByPlatform ? <PlatformListedBadge /> : "—",
    status: (row: AdminDataRow) => <AdminProductStatusCell row={row} />,
  };

  const fetchDetail = useCallback(
    async (row: AdminDataRow) =>
      (await productsApi.detail(String(row.id))) as unknown as Record<
        string,
        unknown
      >,
    [],
  );

  return {
    approvePermission: PERMISSIONS.PRODUCT_APPROVE,
    title: LABELS.products,
    permission: PERMISSIONS.PRODUCT_MANAGE,
    load,
    actions,
    fetchDetail,
    columnKeys: [
      "product",
      "vendorName",
      "categoryName",
      "status",
      "basePrice",
      "listedByPlatform",
    ],
    cellOverrides,
    editor,
    showApprovalQueue: hasPermission(PERMISSIONS.PRODUCT_APPROVE),
    pendingCount: pendingProducts?.total ?? 0,
    filters: { ...values, ...handlers },
  };
}
