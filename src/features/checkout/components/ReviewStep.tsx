import type { CheckoutQuote } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { VendorStrip } from "@/shared/components/VendorStrip";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { CashbackCouponNotice } from "@/shared/components/CashbackCouponNotice";
import { formatInrAmount } from "@/shared/utils/orderFormat";

interface ReviewStepProps {
  quote: CheckoutQuote | null;
  isPending: boolean;
  hasUnavailableItems?: boolean;
  onPlaceOrder: () => void;
  onBack: () => void;
}

function formatInr(value: number) {
  return `₹${formatInrAmount(value)}`;
}

export function ReviewStep({
  quote,
  isPending,
  hasUnavailableItems,
  onPlaceOrder,
  onBack,
}: ReviewStepProps) {
  if (!quote) {
    return (
      <div className="space-y-5">
        <div className="border border-line bg-paper/60 px-5 py-8">
          <p className="font-display text-[1.125rem] text-ink">
            {LABELS.preparingSummary}
          </p>
          <p className="mt-1 text-[0.875rem] text-ink-muted">
            {LABELS.calculatingShippingTaxes}
          </p>
        </div>
        <Button variant="outline" onClick={onBack} fullWidth="mobile">
          {LABELS.backToPayment}
        </Button>
      </div>
    );
  }

  const payable = quote.amountDue ?? quote.grandTotal;

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        {quote.vendorBreakdowns.map((vb) => (
          <section
            key={vb.vendorId}
            className="border border-line bg-surface-raised p-4 shadow-elevation-1 md:p-5"
          >
            <VendorStrip vendor={vb.vendor} />

            <ul className="mt-4 space-y-2.5 border-t border-line pt-4">
              {vb.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-4 text-[0.875rem]"
                >
                  <span className="text-ink">
                    {item.productName}
                    <span className="text-ink-muted">
                      {" "}
                      ·{" "}
                      {formatLabel(LABELS.qtyLabel, {
                        count: String(item.quantity),
                      })}
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums text-ink">
                    {formatInr(item.unitPrice * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[0.875rem]">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">{LABELS.subtotal}</dt>
                <dd className="tabular-nums text-ink">
                  {formatInr(vb.subtotal)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">{LABELS.shipping}</dt>
                <dd className="tabular-nums text-ink">
                  {vb.shippingCost === 0
                    ? LABELS.freeShipping
                    : formatInr(vb.shippingCost)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">
                  {vb.tax.igst > 0 ? LABELS.taxIgst : LABELS.taxCgstSgst}
                </dt>
                <dd className="tabular-nums text-ink">
                  {formatInr(vb.tax.total)}
                </dd>
              </div>
              {vb.discount > 0 && (
                <div className="flex justify-between gap-4 text-success">
                  <dt>{LABELS.couponDiscount}</dt>
                  <dd className="tabular-nums">−{formatInr(vb.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4 border-t border-line pt-3 font-medium">
                <dt className="text-ink">{LABELS.vendorTotal}</dt>
                <dd className="tabular-nums text-ink">{formatInr(vb.total)}</dd>
              </div>
            </dl>
          </section>
        ))}
      </div>

      <div className="relative border border-line bg-surface-raised p-5 shadow-elevation-1">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand via-brand/70 to-transparent"
        />
        {quote.walletAmountToUse > 0 ? (
          <div className="mb-3 flex justify-between gap-4 text-[0.875rem]">
            <span className="text-ink-muted">
              {LABELS.walletAppliedAtCheckout}
            </span>
            <span className="tabular-nums text-ink">
              −{formatInr(quote.walletAmountToUse)}
            </span>
          </div>
        ) : null}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-brand">
              {LABELS.amountDueToday}
            </p>
            <p className="mt-1 text-[0.875rem] text-ink-muted">
              {LABELS.includingShippingTaxes}
            </p>
          </div>
          <p className="font-display text-[1.75rem] leading-none tabular-nums text-brand">
            {formatInr(payable)}
          </p>
        </div>
        {quote.appliedCoupon && quote.appliedCoupon.discount > 0 && (
          <p className="mt-3 text-[0.8125rem] text-success">
            {formatLabel(LABELS.couponAppliedReview, {
              code: quote.appliedCoupon.code,
              amount: formatInr(quote.appliedCoupon.discount),
            })}
          </p>
        )}
        {(quote.cashbackAmount ?? 0) > 0 ? (
          <CashbackCouponNotice
            className="mt-3 text-[0.8125rem] text-brand"
            payNow={payable}
            cashbackAmount={quote.cashbackAmount}
            code={quote.appliedCoupon?.code}
          />
        ) : null}
        {payable <= 0 && quote.walletAmountToUse > 0 ? (
          <p className="mt-3 text-[0.8125rem] font-medium text-success">
            {LABELS.walletFullyCoversOrder}
          </p>
        ) : null}
      </div>

      {hasUnavailableItems && (
        <div className="flex items-start gap-2 rounded-sm border border-warning bg-warning-subtle px-4 py-3">
          <AlertTriangle
            size={16}
            className="mt-0.5 shrink-0 text-warning"
            aria-hidden
          />
          <p className="text-[0.875rem] text-warning-foreground">
            {LABELS.removeUnavailableToCheckout}
          </p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
        <Button variant="outline" onClick={onBack} fullWidth="mobile">
          {LABELS.backToPayment}
        </Button>
        <Button
          size="lg"
          fullWidth="mobile"
          className="gap-2"
          onClick={onPlaceOrder}
          loading={isPending}
          disabled={Boolean(hasUnavailableItems)}
        >
          {LABELS.placeOrder}
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
