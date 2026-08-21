"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { couponsApi } from "@/features/coupons";
import { cartKeys } from "@/features/cart/api/cart.queries";
import { useCheckoutStore } from "@/shared/stores/checkout.store";
import { useRequireAuth } from "@/shared/hooks/useRequireAuth";
import { useAuthStore } from "@/shared/stores/auth.store";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import type { Cart, EligibleCoupon } from "@/shared/api/types";

interface UseCartCouponsOptions {
  cart?: Cart | null;
  enabled?: boolean;
}

export function useCartCoupons({
  cart,
  enabled = true,
}: UseCartCouponsOptions) {
  const queryClient = useQueryClient();
  const { requireAuth } = useRequireAuth();
  const accessToken = useAuthStore((s) => s.accessToken);
  const setCouponCode = useCheckoutStore((s) => s.setCouponCode);
  const appliedCouponCode = useCheckoutStore((s) => s.appliedCouponCode);
  const manualCouponOverride = useCheckoutStore((s) => s.manualCouponOverride);

  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponPending, setCouponPending] = useState(false);
  const [eligible, setEligible] = useState<EligibleCoupon[]>([]);
  const [eligibleLoading, setEligibleLoading] = useState(false);

  const cartApplied = cart?.appliedCoupon ?? null;
  const displayCode = cartApplied?.code ?? appliedCouponCode;
  const displayDiscount = cartApplied?.discount ?? 0;
  const removedReason = cart?.removedCouponReason ?? null;

  const refreshCart = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: cartKeys.all });
  }, [queryClient]);

  const loadEligible = useCallback(async () => {
    if (!accessToken || !enabled) {
      setEligible([]);
      return [];
    }
    setEligibleLoading(true);
    try {
      const list = await couponsApi.eligible();
      setEligible(list);
      return list;
    } catch {
      setEligible([]);
      return [];
    } finally {
      setEligibleLoading(false);
    }
  }, [accessToken, enabled]);

  const applyCoupon = useCallback(
    async (rawCode?: string, opts?: { manual?: boolean }) => {
      const code = (rawCode ?? couponInput).trim();
      if (!code) return;
      if (
        !requireAuth({
          title: LABELS.applyCoupon,
          message: LABELS.signInToApplyCoupon,
        })
      ) {
        return;
      }
      setCouponPending(true);
      setCouponError(null);
      setCouponMessage(null);
      try {
        const result = await couponsApi.apply(code);
        setCouponCode(code, { manual: opts?.manual !== false });
        if (result.discount > 0) {
          setCouponMessage(
            formatLabel(LABELS.couponApplied, {
              amount: String(result.discount),
            }),
          );
        } else if ((result.cashbackAmount ?? 0) > 0) {
          const payNow = cart?.pricingPreview?.grandTotal ?? cart?.total ?? 0;
          setCouponMessage(
            formatLabel(LABELS.cashbackPayNowMessage, {
              payNow: `₹${Number(payNow).toLocaleString("en-IN")}`,
              cashback: `₹${Number(result.cashbackAmount).toLocaleString("en-IN")}`,
            }),
          );
        } else {
          setCouponMessage(LABELS.couponAppliedCheckout);
        }
        setCouponInput("");
        refreshCart();
        void loadEligible();
      } catch (error) {
        setCouponError(getApiErrorMessage(error, LABELS.couponInvalid));
        if (opts?.manual !== false) {
          setCouponCode(null, { manual: true });
        }
      } finally {
        setCouponPending(false);
      }
    },
    [
      couponInput,
      cart?.pricingPreview?.grandTotal,
      cart?.total,
      loadEligible,
      refreshCart,
      requireAuth,
      setCouponCode,
    ],
  );

  const removeCoupon = useCallback(async () => {
    if (
      !requireAuth({
        title: LABELS.removeCoupon,
        message: LABELS.signInToApplyCoupon,
      })
    ) {
      return;
    }
    setCouponPending(true);
    setCouponError(null);
    setCouponMessage(null);
    try {
      await couponsApi.remove();
      setCouponCode(null, { manual: true });
      refreshCart();
      void loadEligible();
    } catch (error) {
      setCouponError(getApiErrorMessage(error, LABELS.couponInvalid));
    } finally {
      setCouponPending(false);
    }
  }, [loadEligible, refreshCart, requireAuth, setCouponCode]);

  // Sync store from cart revalidation
  useEffect(() => {
    if (cartApplied?.code) {
      setCouponCode(cartApplied.code, { manual: manualCouponOverride });
    } else if (removedReason) {
      setCouponCode(null);
      setCouponMessage(removedReason);
    }
  }, [cartApplied?.code, manualCouponOverride, removedReason, setCouponCode]);

  // Load eligible offers without auto-applying
  useEffect(() => {
    if (!enabled || !accessToken || !cart?.items?.length) return;
    void loadEligible();
  }, [accessToken, cart?.items?.length, enabled, loadEligible]);

  useEffect(() => {
    if (!cart?.items?.length) {
      setEligible([]);
    }
  }, [cart?.items?.length]);

  return {
    couponInput,
    setCouponInput,
    couponMessage,
    couponError,
    couponPending,
    appliedCouponCode: displayCode,
    appliedDiscount: displayDiscount,
    eligible,
    eligibleLoading,
    applyCoupon: () => applyCoupon(undefined, { manual: true }),
    applyEligible: (code: string) => applyCoupon(code, { manual: true }),
    removeCoupon,
    refreshEligible: loadEligible,
  };
}
