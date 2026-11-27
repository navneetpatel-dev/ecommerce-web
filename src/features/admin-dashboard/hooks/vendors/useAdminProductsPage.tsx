"use client";

import { ArchiveRestore } from "lucide-react";
import { useCallback, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import {
  PERMISSIONS,
  type PermissionKey,
} from "@/shared/constants/permissions/permissions";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { PlatformListedBadge, productsApi } from "@/features/products";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { adminApi } from "../../api/analytics/admin.api";
import { usePendingProducts } from "../../api/analytics/admin.queries";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { AdminProductRowActions } from "../../components/vendors/AdminProductRowActions.component";
import { useAdminProductEditor } from "./useAdminProductEditor.hook";
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
  cellOverrides: Record<string, (row: AdminDataRow) => ReactNode>;
  editor: ReturnType<typeof useAdminProductEditor>;
};

/** A Super Admin publishing one of the platform's own products: it goes live at once. */
async function publishProduct(id: string, reload: () => void) {
  await productsApi.submitForApproval(id);
  notifySuccess(LABELS.platformProductPublished);
  reload();
}

export function useAdminProductsPage(): AdminProductsPageModel {
  const { hasPermission } = usePermissions();
  const { data: pendingProducts } = usePendingProducts();
  // Bumped after a save so the list reloads.
  const [version, setVersion] = useState(0);
  const bumpVersion = useCallback(() => setVersion((value) => value + 1), []);
  const editor = useAdminProductEditor(bumpVersion);
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
  const debouncedMinPrice = useDebouncedValue(minPrice.trim(), 350);
  const debouncedMaxPrice = useDebouncedValue(maxPrice.trim(), 350);

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
        minPrice: debouncedMinPrice ? Number(debouncedMinPrice) : undefined,
        maxPrice: debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
        sort: sort || undefined,
      }),
    // `version` is bumped after a save: a new `load` makes the list fetch again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      debouncedSearch,
      status,
      categoryId,
      vendorId,
      inStock,
      debouncedMinPrice,
      debouncedMaxPrice,
      sort,
      version,
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

      const publish = () => publishProduct(String(row.id), reload);

      const rowActions = isArchived ? null : (
        <AdminProductRowActions
          product={{ id: String(row.id), name }}
          status={String(row.status ?? "")}
          listedByPlatform={Boolean(row.listedByPlatform)}
          onPreview={editor.openPreview}
          onEdit={editor.openEdit}
          onManageVariants={editor.openVariants}
          onSubmitOnBehalf={editor.openSubmit}
          canPublish={
            editor.isSuperAdmin && !row.vendorId && row.status === "DRAFT"
          }
          onPublish={publish}
        />
      );

      if (isArchived) {
        return (
          <AdminConfirmAction
            label={LABELS.reactivateProduct}
            icon={ArchiveRestore}
            dialogVariant="success"
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
        <>
          {rowActions}
          <AdminConfirmAction
            label={LABELS.archive}
            dialogVariant="warning"
            tone="archive"
            title={LABELS.confirmArchiveProductTitle}
            description={formatLabel(LABELS.confirmArchiveProductBody, {
              name,
            })}
            onConfirm={archiveProduct}
          />
        </>
      );
    },
    [
      editor.openPreview,
      editor.openEdit,
      editor.openVariants,
      editor.openSubmit,
      editor.isSuperAdmin,
    ],
  );

  const cellOverrides = {
    listedByPlatform: (row: AdminDataRow) =>
      row.listedByPlatform ? <PlatformListedBadge /> : "—",
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
