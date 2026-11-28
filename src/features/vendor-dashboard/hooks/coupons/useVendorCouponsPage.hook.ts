"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import {
  useVendorAbsorbedSummary,
  useVendorCouponAnalytics,
  useVendorCoupons,
  vendorCouponKeys,
} from "../../api/coupons/vendor-coupons.queries";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import { QUERY_PARAMS } from "@/shared/constants/navigation/queryParams";
import { couponsApi } from "@/features/coupons";
import type { Coupon } from "@/shared/api/types";
import { useVendorCouponCreate } from "./useVendorCouponCreate.hook";
import { useVendorCouponEditing } from "./useVendorCouponEditing.hook";
import { useVendorCouponFilters } from "./useVendorCouponFilters.hook";

export function useVendorCouponsPage() {
  const user = useAuthStore((s) => s.currentUser);
  const vendorId = user?.vendorId ?? null;
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const resetPage = () => setPage(1);
  const listFilters = useVendorCouponFilters(resetPage);

  const analyticsId = searchParams.get(QUERY_PARAMS.analytics);

  const { data, isLoading } = useVendorCoupons(
    page,
    DEFAULT_PAGE_LIMIT,
    listFilters.query,
  );
  const editing = useVendorCouponEditing(vendorId);
  const { setQuery, ...create } = useVendorCouponCreate(vendorId);
  const analyticsQuery = useVendorCouponAnalytics(analyticsId);
  const absorbedQuery = useVendorAbsorbedSummary();

  const coupons = data?.items ?? [];
  const limit = data?.limit ?? DEFAULT_PAGE_LIMIT;
  const total = data?.total ?? 0;
  const currentPage = data?.page ?? page;
  const from = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const to = Math.min(currentPage * limit, total);
  const totalPages = data?.totalPages ?? 1;
  // Null while loading or after a failure — the summary line hides instead of reading ₹0.
  const absorbedDiscountTotal =
    absorbedQuery.data?.absorbedDiscountTotal ?? null;

  const updateStatus = async (coupon: Coupon, status: Coupon["status"]) => {
    await couponsApi.vendorUpdateStatus(coupon.id, status);
    void queryClient.invalidateQueries({ queryKey: vendorCouponKeys.all });
  };

  return {
    vendorId,
    coupons,
    isLoading,
    ...create,
    pagination: {
      page: currentPage,
      totalPages,
      total,
      from,
      to,
      onPageChange: setPage,
    },
    filters: listFilters.controls,
    analyticsId,
    setAnalyticsId: (id: string | null) => {
      setQuery({ [QUERY_PARAMS.analytics]: id });
    },
    analytics: analyticsQuery.data,
    analyticsLoading: analyticsQuery.isLoading,
    absorbedDiscountTotal,
    updateStatus,
    ...editing,
  };
}
