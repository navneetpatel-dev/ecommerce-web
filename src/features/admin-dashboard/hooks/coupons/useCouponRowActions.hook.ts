"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../api/analytics/admin.api";
import { adminKeys } from "../../api/analytics/admin.queries";
import type { Coupon } from "@/shared/api/types";
import {
  toCouponUpdateBody,
  type CouponFormInput,
} from "../../schemas/coupons/coupons.schema";

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
    mutationFn: ({
      id,
      status,
      note,
    }: {
      id: string;
      status: Coupon["status"];
      note?: string;
    }) => adminApi.updateCouponStatus(id, status, note),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.coupons.all });
    },
  });

  const reload = () => {
    void queryClient.invalidateQueries({ queryKey: adminKeys.coupons.all });
  };

  const changeStatus = (input: {
    id: string;
    status: Coupon["status"];
    note?: string;
  }) => statusMutation.mutateAsync(input).then(reload);

  const [detailCoupon, setDetailCoupon] = useState<Coupon | null>(null);
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);
  const saveCoupon = (values: CouponFormInput, coupon: Coupon) =>
    adminApi
      .updateCoupon(coupon.id, toCouponUpdateBody(values, coupon))
      .then(reload);

  return {
    analyticsCouponId,
    setAnalyticsCouponId,
    analytics: analyticsQuery.data,
    analyticsLoading: analyticsQuery.isLoading,
    changeStatus,
    detailCoupon,
    setDetailCoupon,
    editCoupon,
    setEditCoupon,
    saveCoupon,
  };
}
