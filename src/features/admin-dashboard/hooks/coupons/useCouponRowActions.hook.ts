"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../api/analytics/admin.api";
import { adminKeys } from "../../api/analytics/admin.queries";
import type { Coupon } from "@/shared/api/types";

/**
 * Owns coupon status mutations and the per-coupon analytics query for the
 * coupons table (Rule 1/12: queries and cache invalidation live in hooks).
 */
export function useCouponRowActions() {
  const queryClient = useQueryClient();
  const [analyticsCouponId, setAnalyticsCouponId] = useState<string | null>(
    null,
  );

  const analyticsQuery = useQuery({
    queryKey: adminKeys.couponAnalytics(analyticsCouponId),
    queryFn: () => adminApi.couponAnalytics(analyticsCouponId!),
    enabled: Boolean(analyticsCouponId),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Coupon["status"] }) =>
      adminApi.updateCouponStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.coupons.all });
    },
  });

  const reload = () => {
    void queryClient.invalidateQueries({ queryKey: adminKeys.coupons.all });
  };

  const changeStatus = (input: { id: string; status: Coupon["status"] }) =>
    statusMutation.mutateAsync(input).then(reload);

  return {
    analyticsCouponId,
    setAnalyticsCouponId,
    analytics: analyticsQuery.data,
    analyticsLoading: analyticsQuery.isLoading,
    changeStatus,
  };
}
