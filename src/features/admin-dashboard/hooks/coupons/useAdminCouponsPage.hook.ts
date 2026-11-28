"use client";

import { useState, useMemo } from "react";
import { useUrlTabState } from "@/shared/hooks/navigation/useUrlTabState.hook";
import { useAdminCoupons } from "../../api/analytics/admin.queries";
import { useCreateCoupon } from "./useCreateCoupon.hook";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import { useAdminCouponFilters } from "./useAdminCouponFilters.hook";
import type { CouponFormInput } from "../../schemas/coupons/coupons.schema";

export type CouponsTab = "platform" | "vendor" | "batches";
const COUPON_TABS: readonly CouponsTab[] = ["platform", "vendor", "batches"];
/** The batch whose codes the list is limited to. */
export type CouponBatchFilter = { id: string; name: string };

export function useAdminCouponsPage() {
  const [page, setPage] = useState(1);
  const resetPage = () => setPage(1);
  const listFilters = useAdminCouponFilters(resetPage);
  const { search, status, type, vendorId } = listFilters.values;
  const { debouncedSearch } = listFilters;

  const [tab, setTab] = useUrlTabState(COUPON_TABS, "platform");
  const vendorScoped = tab === "vendor";
  const [batchFilter, setBatchFilter] = useState<CouponBatchFilter | null>(
    null,
  );

  const couponFilters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: status || undefined,
      type: type || undefined,
      vendorId: vendorScoped && vendorId ? vendorId : undefined,
      batchId: batchFilter?.id,
      // Bulk codes would bury everything else: shown only for a chosen batch.
      excludeBatches: !batchFilter && !vendorScoped,
    }),
    [debouncedSearch, status, type, vendorScoped, vendorId, batchFilter],
  );

  const { data, isLoading } = useAdminCoupons(
    page,
    DEFAULT_PAGE_LIMIT,
    vendorScoped,
    couponFilters,
    { enabled: tab !== "batches" },
  );
  const { open, setOpen, createCoupon, form, formLevelError } =
    useCreateCoupon();

  const coupons = data?.items ?? [];
  const limit = data?.limit ?? DEFAULT_PAGE_LIMIT;
  const total = data?.total ?? 0;
  const currentPage = data?.page ?? page;
  const from = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const to = Math.min(currentPage * limit, total);

  const selectTab = (next: CouponsTab) => {
    setTab(next);
    setPage(1);
  };

  const onSubmit = (data: CouponFormInput) => {
    if (createCoupon.isPending) return;
    createCoupon.mutate(data);
  };

  const showBatch = (batch: CouponBatchFilter | null) => {
    setBatchFilter(batch);
    setTab("platform");
    setPage(1);
  };

  return {
    tab,
    setTab: selectTab,
    batchFilter,
    showBatch,
    clearBatchFilter: () => showBatch(null),
    coupons,
    isLoading,
    pagination: {
      page: currentPage,
      totalPages: data?.totalPages ?? 1,
      total,
      from,
      to,
      onPageChange: setPage,
    },
    filters: {
      search,
      status,
      type,
      vendorId,
      onSearchChange: listFilters.onSearchChange,
      onStatusChange: listFilters.onStatusChange,
      onTypeChange: listFilters.onTypeChange,
      onVendorChange: vendorScoped ? listFilters.onVendorChange : undefined,
      onClear: listFilters.onClear,
    },
    open,
    setOpen,
    form,
    isPending: createCoupon.isPending,
    formLevelError,
    onSubmit,
  };
}
