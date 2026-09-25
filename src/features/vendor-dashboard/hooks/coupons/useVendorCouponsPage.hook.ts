"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import {
  CouponSchema,
  VENDOR_COUPON_FORM_DEFAULTS,
  type CouponFormInput,
} from "@/features/admin-dashboard";
import {
  useCreateVendorCoupon,
  useVendorAbsorbedSummary,
  useVendorCouponAnalytics,
  useVendorCoupons,
  vendorCouponKeys,
} from "../../api/coupons/vendor-coupons.queries";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import { QUERY_PARAMS } from "@/shared/constants/navigation/queryParams";
import { couponsApi } from "@/features/coupons";
import { useRouteQueryDialog } from "@/shared/hooks/navigation/useRouteQueryDialog.hook";
import { useApiFormErrors } from "@/shared/hooks/forms/useApiFormErrors.hook";
import { LABELS } from "@/shared/constants/labels";
import type { Coupon } from "@/shared/api/types";

export function useVendorCouponsPage() {
  const user = useAuthStore((s) => s.currentUser);
  const vendorId = user?.vendorId ?? null;
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const dialog = useRouteQueryDialog();
  const [page, setPage] = useState(1);

  const analyticsId = searchParams.get(QUERY_PARAMS.analytics);

  const { data, isLoading } = useVendorCoupons(page, DEFAULT_PAGE_LIMIT);
  const createMutation = useCreateVendorCoupon(vendorId);

  const form = useForm<CouponFormInput>({
    resolver: zodResolver(CouponSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      ...VENDOR_COUPON_FORM_DEFAULTS,
      applicableScopeIds: vendorId ? [vendorId] : [],
    },
  });

  const { formLevelError } = useApiFormErrors(
    form,
    createMutation.error,
    LABELS.couldNotCreateCoupon,
  );
  const analyticsQuery = useVendorCouponAnalytics(analyticsId);
  const absorbedQuery = useVendorAbsorbedSummary();

  useEffect(() => {
    if (!vendorId) return;
    if (form.getValues("applicableScopeType") !== "vendor") return;
    if (form.getValues("applicableScopeIds").length > 0) return;
    form.setValue("applicableScopeIds", [vendorId]);
  }, [vendorId, form]);

  const prevCreateOpenRef = useRef(false);

  useEffect(() => {
    if (dialog.open && !prevCreateOpenRef.current) {
      form.reset({
        ...VENDOR_COUPON_FORM_DEFAULTS,
        applicableScopeIds: vendorId ? [vendorId] : [],
      });
      createMutation.reset();
    }
    prevCreateOpenRef.current = dialog.open;
  }, [dialog.open, vendorId, form, createMutation]);

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

  const setDialogOpen = (next: boolean) => {
    if (next) {
      dialog.openCreate();
      return;
    }
    dialog.close();
  };

  const onSubmit = (values: CouponFormInput) => {
    createMutation.mutate(values, {
      onSuccess: () => dialog.close(),
    });
  };

  const updateStatus = async (coupon: Coupon, status: Coupon["status"]) => {
    await couponsApi.vendorUpdateStatus(coupon.id, status);
    void queryClient.invalidateQueries({ queryKey: vendorCouponKeys.all });
  };

  return {
    vendorId,
    coupons,
    isLoading,
    open: dialog.open,
    setOpen: setDialogOpen,
    form,
    isPending: createMutation.isPending,
    formLevelError,
    onSubmit,
    pagination: {
      page: currentPage,
      totalPages,
      total,
      from,
      to,
      onPageChange: setPage,
    },
    analyticsId,
    setAnalyticsId: (id: string | null) => {
      dialog.setQuery({ [QUERY_PARAMS.analytics]: id });
    },
    analytics: analyticsQuery.data,
    analyticsLoading: analyticsQuery.isLoading,
    absorbedDiscountTotal,
    updateStatus,
  };
}
