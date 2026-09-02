"use client";

import Link from "next/link";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { Button } from "@/shared/components/ui/button";
import { MoneyAmount } from "@/shared/components/MoneyAmount.component";
import { AmountsUnavailableNotice } from "@/shared/components/AmountsUnavailableNotice.component";
import { OrderTaxShippingBreakdown } from "@/shared/components/OrderTaxShippingBreakdown.component";
import { formatInrAmount } from "@/shared/utils/orderFormat";

interface CartDrawerSummaryProps {
  /** Server-computed preview; the drawer only renders the fields it shows. */
  pricingPreview?: {
    merchandiseSubtotal: number;
    taxTotal: number;
    shippingTotal: number;
    shippingDisplayKey: "FREE" | "PAID";
  };
  total: number | undefined;
  totalIsEstimated?: boolean;
  pendingLineTotals?: boolean;
  totalsFetching?: boolean;
  amountsUnavailable?: boolean;
  onRetryAmounts?: () => void;
  hasUnavailableItems?: boolean;
  onClose: () => void;
}

/** Drawer footer: server-computed totals plus the checkout call to action. */
export function CartDrawerSummary({
  pricingPreview,
  total,
  totalIsEstimated = false,
  pendingLineTotals = false,
  totalsFetching = false,
  amountsUnavailable = false,
  onRetryAmounts,
  hasUnavailableItems = false,
  onClose,
}: CartDrawerSummaryProps) {
  const totalRefreshing =
    totalIsEstimated && pendingLineTotals && totalsFetching;
  const totalLabel = totalRefreshing
    ? LABELS.updatingEllipsis
    : totalIsEstimated
      ? LABELS.estimatedTotalLabel
      : LABELS.total;

  return (
    <div className="shrink-0 space-y-3 border-t border-line p-4">
      {pricingPreview ? (
        <dl className="space-y-1.5 text-body-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-ink-muted">{LABELS.subtotal}</dt>
            <dd className="tabular-nums text-ink">
              ₹{formatInrAmount(pricingPreview.merchandiseSubtotal)}
            </dd>
          </div>
          <OrderTaxShippingBreakdown
            className="space-y-1.5 text-body-sm"
            shippingTotal={pricingPreview.shippingTotal}
            shippingDisplayKey={pricingPreview.shippingDisplayKey}
            taxTotal={pricingPreview.taxTotal}
          />
        </dl>
      ) : null}

      <div className="flex items-center justify-between">
        <span className="text-body font-medium">{totalLabel}</span>
        <span className="text-[1.125rem] font-bold text-brand">
          <MoneyAmount
            value={total}
            pending={totalRefreshing}
            unavailable={amountsUnavailable}
            fallbackClassName="text-body font-medium"
          />
        </span>
      </div>

      {amountsUnavailable ? (
        <AmountsUnavailableNotice onRetry={onRetryAmounts} />
      ) : null}

      {hasUnavailableItems ? (
        <p className="rounded-sm bg-warning-subtle px-3 py-2 text-body-sm text-warning-foreground">
          {LABELS.removeUnavailableToCheckout}
        </p>
      ) : (
        <Button asChild size="lg" className="w-full">
          <Link href={PATHS.checkout} onClick={onClose}>
            {LABELS.checkout}
          </Link>
        </Button>
      )}

      <Button asChild variant="outline" className="w-full">
        <Link href={PATHS.cart} onClick={onClose}>
          {LABELS.viewFullCart}
        </Link>
      </Button>
    </div>
  );
}
