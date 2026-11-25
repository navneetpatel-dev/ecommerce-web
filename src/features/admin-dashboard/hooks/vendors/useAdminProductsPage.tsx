"use client";

import { useCallback, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();

  const [userFilters, setUserFilters] = useState<
    Partial<Record<string, string>>
  >({});
  const get = (k: string, alt?: string) =>
    userFilters[k] ??
    searchParams.get(k) ??
    (alt ? searchParams.get(alt) : null) ??
    "";

  const search = get("search", "q");
  const status = get("status");
  const categoryId = get("categoryId");
  const vendorId = get("vendorId");
  const inStock = get("inStock");
  const minPrice = get("minPrice");
  const maxPrice = get("maxPrice");
  const sort = get("sort");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) =>
      productsApi.list({
        page,
        limit,
        search: debouncedSearch || undefined,
        status: status || undefined,
        categoryId: categoryId || undefined,
        vendorId: vendorId || undefined,
        inStock:
          inStock === "true" || inStock === "in_stock" ? true : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort: sort || undefined,
      }),
    [
      debouncedSearch,
      status,
      categoryId,
      vendorId,
      inStock,
      minPrice,
      maxPrice,
      sort,
    ],
  );

  const setFilter = (key: string) => (val: string) =>
    setUserFilters((prev) => ({ ...prev, [key]: val }));

  const onClear = useCallback(() => {
    setUserFilters({
      search: "",
      status: "",
      categoryId: "",
      vendorId: "",
      inStock: "",
      minPrice: "",
      maxPrice: "",
      sort: "",
    });
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
    ],
    showApprovalQueue: hasPermission(PERMISSIONS.PRODUCT_APPROVE),
    pendingCount: pendingProducts?.total ?? 0,
    filters: {
      search,
      status,
      categoryId,
      vendorId,
      inStock,
      minPrice,
      maxPrice,
      sort,
      onSearchChange: setFilter("search"),
      onStatusChange: setFilter("status"),
      onCategoryChange: setFilter("categoryId"),
      onVendorChange: setFilter("vendorId"),
      onInStockChange: setFilter("inStock"),
      onMinPriceChange: setFilter("minPrice"),
      onMaxPriceChange: setFilter("maxPrice"),
      onSortChange: setFilter("sort"),
      onClear,
    },
  };
}
