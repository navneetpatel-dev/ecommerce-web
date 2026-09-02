import Image from "next/image";
import { LABELS } from "@/shared/constants/labels";
import { VendorStrip } from "@/shared/components/VendorStrip.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { CashbackCouponNotice } from "@/shared/components/CashbackCouponNotice.component";
import type { CartItem, CheckoutQuote } from "@/shared/api/types";
import { formatInrAmount } from "@/shared/utils/orderFormat";
import { resolveCartLineSubtotal } from "../../utils/checkoutDisplay.utils";

interface OrderSummaryPanelProps {
  groupedByVendor: Record<string, CartItem[]>;
  subtotal: number;
  estimatedTotal: number;
  quote?: CheckoutQuote | null;
}

export function OrderSummaryPanel({
  groupedByVendor,
  subtotal,
  estimatedTotal,
  quote,
}: OrderSummaryPanelProps) {
  const items = Object.values(groupedByVendor).flat();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const walletApplied = (quote?.walletAmountToUse ?? 0) > 0;
  const displayTotal = walletApplied
    ? (quote?.amountDue ?? 0)
    : (quote?.grandTotal ?? estimatedTotal);
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
  const vendorEntries = Object.entries(groupedByVendor);

  return (
    <div className="relative flex max-h-[calc(100vh-7rem)] flex-col border border-line bg-surface-raised shadow-elevation-1">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 bg-gradient-to-r from-brand via-brand/70 to-transparent"
      />

      <div className="shrink-0 border-b border-line px-5 pb-4 pt-5 md:px-6 md:pt-6">
        <p className="text-[0.875rem] text-ink-muted">
          {itemCount} {itemCount === 1 ? "item" : "items"}
          <span className="mx-2 text-line">·</span>
          <span className="font-medium text-ink">
            ₹{formatInrAmount(displayTotal)}
          </span>
        </p>
        <TextEyebrow className="mt-4">Order summary</TextEyebrow>
        <h2 className="mt-1 font-display text-[1.25rem] text-ink">Your bag</h2>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-4 md:px-6">
        {vendorEntries.map(([vendorId, vendorItems]) => (
          <div key={vendorId}>
            <VendorStrip vendor={vendorItems[0]?.product?.vendor} size="sm" />
            <ul className="mt-3 space-y-3">
              {vendorItems.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm border border-line bg-paper">
                    {item.product.imageUrl ? (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.875rem] font-medium text-ink">
                      {item.product.name}
                    </p>
                    <p className="mt-0.5 text-[0.75rem] text-ink-muted">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 text-[0.875rem] tabular-nums text-ink">
                    ₹{formatInrAmount(resolveCartLineSubtotal(item, quote))}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="shrink-0 border-t border-line bg-surface-raised px-5 py-4 md:px-6 md:py-5">
        <dl className="space-y-2.5 text-[0.875rem]">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-ink-muted">Subtotal</dt>
            <dd className="tabular-nums text-ink">₹{formatInrAmount(subtotal)}</dd>
          </div>
          {quote?.appliedCoupon && (
            <div className="flex items-center justify-between gap-4 text-success">
              <dt>Coupon · {quote.appliedCoupon.code}</dt>
              <dd className="tabular-nums">
                −₹{formatInrAmount(quote.appliedCoupon.discount)}
              </dd>
            </div>
          )}
          {(quote?.cashbackAmount ?? 0) > 0 ? (
            <CashbackCouponNotice
              payNow={quote?.amountDue ?? estimatedTotal}
              cashbackAmount={quote?.cashbackAmount ?? 0}
              code={quote?.appliedCoupon?.code}
              className="text-body-sm text-brand"
            />
          ) : null}
          {(quote?.walletAmountToUse ?? 0) > 0 ? (
            <div className="flex items-center justify-between gap-4 text-body-sm">
              <dt className="text-ink-muted">
                {LABELS.walletAppliedAtCheckout}
              </dt>
              <dd className="tabular-nums text-ink">
                −₹{quote?.walletAmountToUse ?? formatInrAmount(0)}
              </dd>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-4">
            <dt className="text-ink-muted">Shipping & tax</dt>
            <dd className="text-right text-ink-muted">
              {quote ? "Included below" : "Confirmed on review"}
            </dd>
          </div>
        </dl>

        <div className="mt-4 border-t border-line pt-4">
          <div className="flex items-end justify-between gap-4">
            <span className="text-[0.875rem] font-medium text-ink">
              {totalLabel}
            </span>
            <span className="font-display text-[1.5rem] leading-none tabular-nums text-brand">
              ₹{formatInrAmount(displayTotal)}
            </span>
          </div>
          {walletApplied && quote ? (
            <p className="mt-1.5 text-[0.75rem] text-ink-muted">
              {LABELS.orderTotalLabel}: ₹{formatInrAmount(quote.grandTotal)}
            </p>
          ) : null}
          <p className="mt-1.5 text-[0.75rem] text-ink-muted">{totalHint}</p>
        </div>
      </div>
    </div>
  );
}
