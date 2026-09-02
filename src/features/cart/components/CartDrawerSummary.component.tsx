"use client";

import Link from "next/link";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { Button } from "@/shared/components/ui/button";
import { MoneyAmount } from "@/shared/components/MoneyAmount.component";
import { AmountsUnavailableNotice } from "@/shared/components/AmountsUnavailableNotice.component";
import { OrderTaxShippingBreakdown } from "@/shared/components/OrderTaxShippingBreakdown.component";
import { InlineAmountSkeleton } from "@/shared/components/InlineAmountSkeleton.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { formatInrAmount } from "@/shared/utils/orderFormat";

interface CartSummaryLinkProps {
  href: string;
  label: string;
  disabled: boolean;
  onClose: () => void;
  variant?: "default" | "outline";
}

function CartSummaryLink({
  href,
  label,
  disabled,
  onClose,
  variant = "default",
}: CartSummaryLinkProps) {
  return (
    <DisabledActionHint
      disabled={disabled}
      message={LABELS.cartUpdatingActionHint}
      block
    >
      {disabled ? (
        <Button type="button" variant={variant} className="w-full" disabled>
          {label}
        </Button>
      ) : (
        <Button asChild variant={variant} className="w-full">
          <Link href={href} onClick={onClose}>
            {label}
          </Link>
        </Button>
      )}
    </DisabledActionHint>
  );
}

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
  isCartMutating?: boolean;
  amountsUnavailable?: boolean;
  onRetryAmounts?: () => void;
  hasUnavailableItems?: boolean;
  onClose: () => void;
}

/** Drawer footer: server-computed totals plus the checkout call to action. */
export function CartDrawerSummary({
  pricingPreview,
  total,
  pendingLineTotals = false,
  totalsFetching = false,
  isCartMutating = false,
  amountsUnavailable = false,
  onRetryAmounts,
  hasUnavailableItems = false,
  onClose,
}: CartDrawerSummaryProps) {
  const amountsPending = pendingLineTotals && !amountsUnavailable;
  const totalRefreshing = total == null || amountsPending || totalsFetching;

  return (
    <div className="shrink-0 space-y-3 border-t border-line p-4">
      {pricingPreview || amountsPending ? (
        <dl className="space-y-1.5 text-body-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-ink-muted">{LABELS.subtotal}</dt>
            <dd className="tabular-nums text-ink">
              {amountsPending ? (
                <InlineAmountSkeleton />
              ) : (
                <>₹{formatInrAmount(pricingPreview!.merchandiseSubtotal)}</>
              )}
            </dd>
          </div>
          <OrderTaxShippingBreakdown
            className="space-y-1.5 text-body-sm"
            pending={amountsPending}
            shippingTotal={pricingPreview?.shippingTotal}
            shippingDisplayKey={pricingPreview?.shippingDisplayKey}
            taxTotal={pricingPreview?.taxTotal}
          />
        </dl>
      ) : null}

      <div className="flex items-center justify-between">
        <span className="text-body font-medium">{LABELS.total}</span>
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
        <CartSummaryLink
          href={PATHS.checkout}
          label={LABELS.checkout}
          disabled={isCartMutating}
          onClose={onClose}
        />
      )}

      <CartSummaryLink
        href={PATHS.cart}
        label={LABELS.viewFullCart}
        disabled={isCartMutating}
        onClose={onClose}
        variant="outline"
      />
    </div>
  );
}
