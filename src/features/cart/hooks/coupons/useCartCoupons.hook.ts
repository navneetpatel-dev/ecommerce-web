"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { couponsApi } from "@/features/coupons";
import { cartKeys } from "../../api/cart/cart.queries";
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

  const [couponInput, setCouponInput] = useState("");
  // The "applied" message belongs to one coupon on one cart: it goes once the cart
  // changes or that coupon stops applying, so it can't contradict the notice below.
  const [appliedNotice, setAppliedNotice] = useState<{
    code: string;
    text: string;
    signature: string;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponPending, setCouponPending] = useState(false);

  const hasItems = Boolean(cart?.items?.length);
  const cartSignature = (cart?.items ?? [])
    .map((item) => `${item.variantId}:${item.quantity}`)
    .join(",");
  const { eligible, eligibleLoading, eligibleError, loadEligible } =
    useCouponEligibility(enabled, hasItems, cartSignature);

  const cartApplied = cart?.appliedCoupon ?? null;
  const displayCode = cartApplied?.code ?? null;
  const displayDiscount = cartApplied?.discount ?? 0;
  const inactiveCoupons = cart?.inactiveCoupons ?? [];
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
    async (rawCode?: string) => {
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
      setAppliedNotice(null);
      try {
        const result = await couponsApi.apply(code);
        setAppliedNotice({
          code: code.toUpperCase(),
          text: describeApplyResult(result),
          signature: cartSignature,
        });
        setCouponInput("");
        refreshCart();
        void loadEligible();
      } catch (error) {
        setCouponError(getApiErrorMessage(error, LABELS.couponInvalid));
      } finally {
        setCouponPending(false);
      }
    },
    [cartSignature, couponInput, loadEligible, refreshCart, requireAuth],
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
      setAppliedNotice(null);
      try {
        await couponsApi.remove(code);
        refreshCart();
        void loadEligible();
      } catch (error) {
        setCouponError(getApiErrorMessage(error, LABELS.couponInvalid));
      } finally {
        setCouponPending(false);
      }
    },
    [loadEligible, refreshCart, requireAuth],
  );

  const noticeStillTrue =
    appliedNotice !== null &&
    appliedNotice.signature === cartSignature &&
    appliedCoupons.some(
      (coupon) => coupon.code?.toUpperCase() === appliedNotice.code,
    ) &&
    !inactiveCoupons.some(
      (coupon) => coupon.code?.toUpperCase() === appliedNotice.code,
    );
  const couponMessage = noticeStillTrue ? appliedNotice.text : null;

  const applyFromInput = () => applyCoupon();
  const applyEligibleCode = (code: string) => applyCoupon(code);

  return {
    couponInput,
    setCouponInput,
    couponMessage,
    couponError,
    couponPending,
    appliedCouponCode: displayCode,
    appliedDiscount: displayDiscount,
    appliedCoupons,
    inactiveCoupons,
    eligible,
    eligibleLoading,
    eligibleError,
    applyCoupon: applyFromInput,
    applyEligible: applyEligibleCode,
    removeCoupon,
    refreshEligible: loadEligible,
  };
}
