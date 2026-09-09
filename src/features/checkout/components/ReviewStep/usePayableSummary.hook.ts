"use client";

import { useMemo } from "react";
import type { CheckoutQuote } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInr } from "@/shared/utils/orderFormat";
import { formatPoints } from "@/shared/utils/formatPoints";

interface UsePayableSummaryParams {
  quote: CheckoutQuote;
  payable: number;
}

export function usePayableSummary({ quote, payable }: UsePayableSummaryParams) {
  const showsWallet = quote.walletAmountToUse > 0;
  const cashbackAmount = quote.cashbackAmount ?? 0;
  const walletCoversOrder = payable <= 0 && showsWallet;

  const appliedCouponLines = useMemo(() => {
    const appliedCoupons = quote.appliedCoupons?.length
      ? quote.appliedCoupons
      : quote.appliedCoupon
        ? [quote.appliedCoupon]
        : [];

    return appliedCoupons
      .filter((coupon) => coupon.discount > 0)
      .map((coupon) =>
        formatLabel(LABELS.couponAppliedReview, {
          code: coupon.code,
          amount: formatInr(coupon.discount),
        }),
      );
  }, [quote]);

  const formattedWalletPoints = formatPoints(quote.walletAmountToUse);

  const formattedGiftWrapFee = quote.giftWrapFeeAmount
    ? formatInr(quote.giftWrapFeeAmount)
    : null;

  const formattedPayable = formatInr(payable);

  return {
    showsWallet,
    cashbackAmount,
    walletCoversOrder,
    appliedCouponLines,
    formattedWalletPoints,
    formattedGiftWrapFee,
    formattedPayable,
  };
}
