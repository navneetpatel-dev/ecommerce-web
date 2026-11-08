"use client";

import { useReturnEstimate } from "@/features/returns";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInr } from "@/shared/utils/formatting/orderFormat";

export type ReturnEstimateView = {
  refundLine: string;
  /** Set when the refund is cut (or nothing) because the kept items lose an offer. */
  offerWarning: string | null;
  cashbackNote: string | null;
  feeNote: string | null;
  /** A ₹0 refund: worth saying plainly before the item is sent back. */
  nothingBack: boolean;
};

/**
 * The refund this return would give, asked before it's submitted and worded for the dialog.
 * All amounts are the server's; nothing is calculated here.
 */
export function useSubOrderReturnEstimate(
  orderItemId: string | null,
  returnQuantity: number,
  reasonCode: string,
  enabled: boolean,
): { estimate: ReturnEstimateView | null; isLoading: boolean } {
  const query = useReturnEstimate(
    enabled ? orderItemId : null,
    returnQuantity,
    reasonCode,
  );
  const data = query.data;
  if (!enabled || !data)
    return { estimate: null, isLoading: enabled && query.isLoading };

  const offers = data.offerNames.join(", ") || LABELS.returnEstimateTheOffer;
  const nothingBack = data.refund <= 0;
  const offerWarning =
    data.offerAdjustment > 0
      ? nothingBack
        ? formatLabel(LABELS.returnEstimateNothingBack, { offers })
        : formatLabel(LABELS.returnEstimateOfferCut, {
            amount: formatInr(data.offerAdjustment),
            offers,
          })
      : null;
  return {
    isLoading: false,
    estimate: {
      refundLine: formatLabel(LABELS.returnEstimateRefund, {
        amount: formatInr(data.refund),
      }),
      offerWarning,
      cashbackNote:
        data.cashbackClawback > 0
          ? formatLabel(LABELS.returnEstimateCashback, {
              amount: formatInr(data.cashbackClawback),
            })
          : null,
      feeNote:
        data.returnShippingFee > 0
          ? formatLabel(LABELS.returnEstimateFee, {
              amount: formatInr(data.returnShippingFee),
            })
          : null,
      nothingBack,
    },
  };
}
