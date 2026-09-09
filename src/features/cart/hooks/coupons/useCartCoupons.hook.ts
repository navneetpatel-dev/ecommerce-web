"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { couponsApi } from "@/features/coupons";
import { cartKeys } from "../../api/cart/cart.queries";
import { useCheckoutStore } from "@/features/checkout";
import { useRequireAuth } from "@/shared/hooks/auth/useRequireAuth.hook";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type { Cart } from "@/shared/api/types";
import { useCouponEligibility } from "./useCouponEligibility.hook";
import { describeApplyResult } from "../../utils/coupons/couponMessages";

interface UseCartCouponsOptions {
  cart?: Cart | null;
  enabled?: boolean;
}

/** Cart coupon apply/remove flow; eligibility loading lives in its own hook. */
export function useCartCoupons({
  cart,
  enabled = true,
}: UseCartCouponsOptions) {
  const queryClient = useQueryClient();
  const { requireAuth } = useRequireAuth();
  const setCouponCode = useCheckoutStore((s) => s.setCouponCode);
  const appliedCouponCode = useCheckoutStore((s) => s.appliedCouponCode);
  const manualCouponOverride = useCheckoutStore((s) => s.manualCouponOverride);

  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponPending, setCouponPending] = useState(false);

  const hasItems = Boolean(cart?.items?.length);
  const { eligible, eligibleLoading, eligibleError, loadEligible } =
    useCouponEligibility(enabled, hasItems);

  const cartApplied = cart?.appliedCoupon ?? null;
  const displayCode = cartApplied?.code ?? appliedCouponCode;
  const displayDiscount = cartApplied?.discount ?? 0;
  const removedReason = cart?.removedCouponReason ?? null;
  // Stacked codes — fall back to the singular field for older cart responses.
  const appliedCoupons = cart?.appliedCoupons?.length
    ? cart.appliedCoupons
    : cartApplied
      ? [cartApplied]
      : [];

  const refreshCart = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: cartKeys.all });
  }, [queryClient]);

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
        setCouponMessage(describeApplyResult(result));
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
    [couponInput, cart, loadEligible, refreshCart, requireAuth, setCouponCode],
  );

  /** Omit `code` to clear every stacked coupon (legacy "Remove" behavior). */
  const removeCoupon = useCallback(
    async (code?: string) => {
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
        const result = await couponsApi.remove(code);
        if (!code || result.cleared) {
          setCouponCode(null, { manual: true });
        }
        refreshCart();
        void loadEligible();
      } catch (error) {
        setCouponError(getApiErrorMessage(error, LABELS.couponInvalid));
      } finally {
        setCouponPending(false);
      }
    },
    [loadEligible, refreshCart, requireAuth, setCouponCode],
  );

  // Sync store from cart revalidation
  useEffect(() => {
    if (cartApplied?.code) {
      setCouponCode(cartApplied.code, { manual: manualCouponOverride });
    } else if (removedReason) {
      setCouponCode(null);
      setCouponMessage(removedReason);
    }
  }, [cartApplied?.code, manualCouponOverride, removedReason, setCouponCode]);

  const applyFromInput = () => applyCoupon(undefined, { manual: true });
  const applyEligibleCode = (code: string) =>
    applyCoupon(code, { manual: true });

  return {
    couponInput,
    setCouponInput,
    couponMessage,
    couponError,
    couponPending,
    appliedCouponCode: displayCode,
    appliedDiscount: displayDiscount,
    appliedCoupons,
    eligible,
    eligibleLoading,
    eligibleError,
    applyCoupon: applyFromInput,
    applyEligible: applyEligibleCode,
    removeCoupon,
    refreshEligible: loadEligible,
  };
}
