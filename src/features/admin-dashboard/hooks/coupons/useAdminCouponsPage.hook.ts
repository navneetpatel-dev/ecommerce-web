"use client";

import { useState, useCallback, useMemo } from "react";
import { useUrlTabState } from "@/shared/hooks/navigation/useUrlTabState.hook";
import { useAdminCoupons } from "../../api/analytics/admin.queries";
import { useCreateCoupon } from "./useCreateCoupon.hook";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import type { CouponFormInput } from "../../schemas/coupons/coupons.schema";

export type CouponsTab = "platform" | "vendor" | "batches";
const COUPON_TABS: readonly CouponsTab[] = ["platform", "vendor", "batches"];

export function useAdminCouponsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const [tab, setTab] = useUrlTabState(COUPON_TABS, "platform");
  const vendorScoped = tab === "vendor";

  const couponFilters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: status || undefined,
    }),
    [debouncedSearch, status],
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

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setStatus(value);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearch("");
    setStatus("");
    setPage(1);
  }, []);

  const onSubmit = (data: CouponFormInput) => {
    if (createCoupon.isPending) return;
    createCoupon.mutate(data);
  };

  return {
    tab,
    setTab: selectTab,
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
      onSearchChange: handleSearchChange,
      onStatusChange: handleStatusChange,
      onClear: handleClearFilters,
    },
    open,
    setOpen,
    form,
    isPending: createCoupon.isPending,
    formLevelError,
    onSubmit,
  };
}
