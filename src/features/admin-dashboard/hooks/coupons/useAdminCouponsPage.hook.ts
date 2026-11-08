"use client";

import { useState } from "react";
import { useAdminCoupons } from "../../api/analytics/admin.queries";
import { useCreateCoupon } from "./useCreateCoupon.hook";
import { useCouponFilters } from "./useCouponFilters.hook";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import type { CouponFormInput } from "../../schemas/coupons/coupons.schema";

export type CouponsTab = "platform" | "vendor";
/** The batch whose codes the list is limited to. */
export type CouponBatchFilter = { id: string; name: string };

export function useAdminCouponsPage() {
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<CouponsTab>("platform");
  const vendorScoped = tab === "vendor";
  const [batchFilter, setBatchFilter] = useState<CouponBatchFilter | null>(
    null,
  );
  const filters = useCouponFilters(() => setPage(1));
  const { data, isLoading } = useAdminCoupons(
    page,
    DEFAULT_PAGE_LIMIT,
    vendorScoped,
    {
      ...filters.query,
      // Bulk codes would bury everything else: shown only for a chosen batch.
      batchId: batchFilter?.id,
      excludeBatches: !batchFilter && !vendorScoped,
    },
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
  const onSubmit = (data: CouponFormInput) => createCoupon.mutate(data);
  const showBatch = (batch: CouponBatchFilter | null) => {
    setBatchFilter(batch);
    setTab("platform");
    setPage(1);
  };

  return {
    tab,
    setTab: selectTab,
    filters,
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
    open,
    setOpen,
    form,
    isPending: createCoupon.isPending,
    formLevelError,
    onSubmit,
  };
}
