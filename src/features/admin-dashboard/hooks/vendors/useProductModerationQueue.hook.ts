"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAdminDataList } from "../shared/useAdminDataList.hook";
import { useProductModeration } from "./useProductModeration.hook";
import { adminApi } from "../../api/analytics/admin.api";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { PRODUCT_STATUS } from "@/shared/constants/statuses";
import { ROLES } from "@/shared/constants/labels";
import { ERROR_CODES } from "@/shared/constants/http/errors";
import { isApiErrorCode } from "@/shared/types/apiError.types";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import type { ProductDetail } from "@/shared/api/types";
import type { AdminProductsFiltersProps } from "../../components/vendors/AdminProductsFilters.component";

export function useProductModerationQueue() {
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
      adminApi.pendingProducts({
        page,
        limit,
        search: debouncedSearch || undefined,
        categoryId: categoryId || undefined,
        vendorId: vendorId || undefined,
        inStock:
          inStock === "true" || inStock === "in_stock" ? true : undefined,
        minPrice: debouncedMinPrice ? Number(debouncedMinPrice) : undefined,
        maxPrice: debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
        sort: sort || undefined,
      }),
    [
      debouncedSearch,
      categoryId,
      vendorId,
      inStock,
      debouncedMinPrice,
      debouncedMaxPrice,
      sort,
    ],
  );

  const list = useAdminDataList(load);
  const { approve, reject } = useProductModeration();

  const setFilter = (key: string) => (val: string) => {
    setUserFilters((prev) => ({ ...prev, [key]: val }));
  };

  const onClear = useCallback(() => {
    setUserFilters({
      search: "",
      categoryId: "",
      vendorId: "",
      inStock: "",
      minPrice: "",
      maxPrice: "",
      sort: "",
    });
  }, []);

  const isSuperAdmin = useAuthStore(
    (state) => state.currentUser?.role === ROLES.SUPER_ADMIN,
  );
  // A Super Admin who prepared a listing is refused as approver; they may approve it with a reason.
  const [ownWorkId, setOwnWorkId] = useState<string | null>(null);

  const onApprove = useCallback(
    async (id: string) => {
      try {
        await approve.mutateAsync({ id });
      } catch (err: unknown) {
        if (
          isSuperAdmin &&
          isApiErrorCode(err, ERROR_CODES.PRODUCT_APPROVER_NOT_INDEPENDENT)
        ) {
          setOwnWorkId(id);
          return;
        }
        throw err;
      }
      list.reload();
    },
    [approve, list, isSuperAdmin],
  );

  const onApproveOwnWork = useCallback(
    async (ownWorkReason: string) => {
      if (!ownWorkId) return;
      await approve.mutateAsync({ id: ownWorkId, ownWorkReason });
      setOwnWorkId(null);
      list.reload();
    },
    [approve, list, ownWorkId],
  );
  const closeOwnWork = useCallback(() => setOwnWorkId(null), []);

  const onReject = useCallback(
    async (id: string, note: string) => {
      await reject.mutateAsync({ id, note });
      list.reload();
    },
    [reject, list],
  );

  const hasFilters = Boolean(
    search.trim() ||
    categoryId ||
    vendorId ||
    inStock ||
    minPrice ||
    maxPrice ||
    sort,
  );

  const filters: AdminProductsFiltersProps = {
    search,
    status: PRODUCT_STATUS.PENDING_APPROVAL,
    statusDisabled: true,
    categoryId,
    vendorId,
    inStock,
    minPrice,
    maxPrice,
    sort,
    onSearchChange: setFilter("search"),
    onStatusChange: () => {},
    onCategoryChange: setFilter("categoryId"),
    onVendorChange: setFilter("vendorId"),
    onInStockChange: setFilter("inStock"),
    onMinPriceChange: setFilter("minPrice"),
    onMaxPriceChange: setFilter("maxPrice"),
    onSortChange: setFilter("sort"),
    onClear,
  };

  return {
    products: list.rows as unknown as ProductDetail[],
    isLoading: list.loading,
    filters,
    hasFilters,
    reload: list.reload,
    pagination: {
      page: list.page,
      totalPages: list.totalPages,
      total: list.total,
      from: list.from,
      to: list.to,
      onPageChange: list.onPageChange,
    },
    onApprove,
    ownWorkOpen: ownWorkId !== null,
    onApproveOwnWork,
    closeOwnWork,
    onReject,
    isApproving: approve.isPending,
    isRejecting: reject.isPending,
  };
}
