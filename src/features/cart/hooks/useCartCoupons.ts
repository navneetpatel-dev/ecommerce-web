"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { couponsApi } from "@/features/coupons";
import { cartKeys } from "../api/cart.queries";
import { useCheckoutStore } from "@/shared/stores/checkout.store";
import { useRequireAuth } from "@/shared/hooks/useRequireAuth";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import type { Cart } from "@/shared/api/types";
import { formatInrAmount } from "@/shared/utils/orderFormat";
import { useCouponEligibility } from "./useCouponEligibility";

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
        setCouponMessage(describeApplyResult(result, cart));
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
    eligibleError,
    applyCoupon: () => applyCoupon(undefined, { manual: true }),
    applyEligible: (code: string) => applyCoupon(code, { manual: true }),
    removeCoupon,
    refreshEligible: loadEligible,
  };
}

function describeApplyResult(
  result: Awaited<ReturnType<typeof couponsApi.apply>>,
  cart?: Cart | null,
): string {
  if (result.discount > 0) {
    return formatLabel(LABELS.couponApplied, {
      amount: String(result.discount),
    });
  }
  if ((result.cashbackAmount ?? 0) > 0) {
    const payNow = cart?.pricingPreview?.grandTotal ?? cart?.total ?? 0;
    return formatLabel(LABELS.cashbackPayNowMessage, {
      payNow: `₹${formatInrAmount(Number(payNow))}`,
      cashback: `₹${formatInrAmount(Number(result.cashbackAmount))}`,
    });
  }
  return LABELS.couponAppliedCheckout;
}
