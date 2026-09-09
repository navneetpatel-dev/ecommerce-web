"use client";

import { useMemo, type ChangeEvent, type KeyboardEvent } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInrAmount } from "@/shared/utils/orderFormat";
import type { AppliedCouponSummary, EligibleCoupon } from "@/shared/api/types";

export interface UnusedOfferViewModel {
  code: string;
  discountText: string;
}

interface UseCartCouponSectionParams {
  couponInput: string;
  appliedCouponCode: string | null;
  appliedDiscount?: number;
  appliedCoupons?: AppliedCouponSummary[];
  eligible: EligibleCoupon[];
  onCouponInputChange: (value: string) => void;
  onApplyCoupon: () => void;
}

export function useCartCouponSection({
  couponInput,
  appliedCouponCode,
  appliedDiscount = 0,
  appliedCoupons = [],
  eligible,
  onCouponInputChange,
  onApplyCoupon,
}: UseCartCouponSectionParams) {
  const chips: AppliedCouponSummary[] = useMemo(() => {
    if (appliedCoupons.length > 0) return appliedCoupons;
    if (appliedCouponCode) {
      return [{ code: appliedCouponCode, discount: appliedDiscount }];
    }
    return [];
  }, [appliedCoupons, appliedCouponCode, appliedDiscount]);

  const unusedOffers = useMemo<UnusedOfferViewModel[]>(() => {
    const appliedCodes = new Set(chips.map((c) => c.code.toUpperCase()));
    return eligible
      .filter((offer) => !appliedCodes.has(offer.code.toUpperCase()))
      .map((offer) => ({
        code: offer.code,
        discountText:
          offer.discount > 0
            ? ` · ₹${formatInrAmount(offer.discount)} ${LABELS.couponDiscount.toLowerCase()}`
            : "",
      }));
  }, [chips, eligible]);

  const offersLabel =
    unusedOffers.length > 0
      ? formatLabel(LABELS.availableOffersCount, { count: unusedOffers.length })
      : LABELS.availableOffers;

  const applyDisabled = !couponInput.trim();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onCouponInputChange(e.target.value);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onApplyCoupon();
    }
  };

  return {
    chips,
    unusedOffers,
    offersLabel,
    applyDisabled,
    handleInputChange,
    handleInputKeyDown,
  };
}
