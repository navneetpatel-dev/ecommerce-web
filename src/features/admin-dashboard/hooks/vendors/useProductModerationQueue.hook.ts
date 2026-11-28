"use client";

import { useCallback, useState } from "react";
import { useAdminDataList } from "../shared/useAdminDataList.hook";
import { useProductModeration } from "./useProductModeration.hook";
import { adminApi } from "../../api/analytics/admin.api";
import { useProductListFilters } from "./useProductListFilters.hook";
import { PRODUCT_STATUS } from "@/shared/constants/statuses";
import { ROLES } from "@/shared/constants/labels";
import { ERROR_CODES } from "@/shared/constants/http/errors";
import { isApiErrorCode } from "@/shared/types/apiError.types";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import type { ProductDetail } from "@/shared/api/types";
import type { AdminProductsFiltersProps } from "../../components/vendors/AdminProductsFilters.component";

export function useProductModerationQueue() {
  const { values, query, handlers } = useProductListFilters();
  const { search, categoryId, vendorId, inStock, minPrice, maxPrice, sort } =
    values;

  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) =>
      adminApi.pendingProducts({ page, limit, ...query }),
    [query],
  );

  const list = useAdminDataList(load);
  const { approve, reject } = useProductModeration();

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
    ...values,
    ...handlers,
    // The queue only ever lists products waiting for approval.
    status: PRODUCT_STATUS.PENDING_APPROVAL,
    statusDisabled: true,
    onStatusChange: () => {},
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
