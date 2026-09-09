"use client";

import { useMemo } from "react";
import type { CartItem, CheckoutQuote } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";
import { taxDisplayLabel } from "@/shared/utils/formatting/taxDisplay";
import { quoteOrderTotals } from "../../utils/checkout/quoteTotals.utils";

interface UseOrderSummaryPanelParams {
  groupedByVendor: Record<string, CartItem[]>;
  subtotal?: number;
  subtotalPending?: boolean;
  estimatedTotal?: number;
  estimatedTotalPending?: boolean;
  quote?: CheckoutQuote | null;
}

export function useOrderSummaryPanel({
  groupedByVendor,
  subtotal,
  subtotalPending = false,
  estimatedTotal,
  estimatedTotalPending = false,
  quote,
}: UseOrderSummaryPanelParams) {
  const orderTotals = useMemo(() => {
    return quote ? quoteOrderTotals(quote) : null;
  }, [quote]);

  const appliedCoupons = useMemo(() => {
    if (quote?.appliedCoupons?.length) return quote.appliedCoupons;
    if (quote?.appliedCoupon) return [quote.appliedCoupon];
    return [];
  }, [quote]);

  const summarySubtotal = orderTotals?.merchandiseSubtotal ?? subtotal;
  const summarySubtotalPending =
    !orderTotals && (subtotalPending || summarySubtotal == null);

  const itemCount = useMemo(() => {
    const items = Object.values(groupedByVendor).flat();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [groupedByVendor]);

  const itemCountText = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;

  const walletApplied = (quote?.walletAmountToUse ?? 0) > 0;
  const displayTotal = walletApplied
    ? quote?.amountDue
    : (quote?.grandTotal ?? estimatedTotal);
  const displayTotalPending =
    displayTotal == null || (!quote && estimatedTotalPending);

  const totalLabel = !quote
    ? LABELS.estimatedTotalLabel
    : walletApplied
      ? LABELS.amountDueToday
      : LABELS.orderTotalLabel;

  const totalHint = !quote
    ? "Shipping and taxes confirmed before you place the order."
    : walletApplied
      ? "Amount left to pay after points."
      : "Final amount including shipping and taxes.";

  const walletAmountFormatted = quote?.walletAmountToUse
    ? formatInrAmount(quote.walletAmountToUse)
    : null;

  const grandTotalFormatted = quote?.grandTotal
    ? formatInrAmount(quote.grandTotal)
    : null;

  const taxLabel = orderTotals
    ? taxDisplayLabel(orderTotals.taxDisplayKey)
    : undefined;

  return {
    orderTotals,
    appliedCoupons,
    summarySubtotal,
    summarySubtotalPending,
    itemCountText,
    walletApplied,
    displayTotal,
    displayTotalPending,
    totalLabel,
    totalHint,
    walletAmountFormatted,
    grandTotalFormatted,
    taxLabel,
  };
}
