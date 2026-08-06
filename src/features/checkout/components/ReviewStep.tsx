import type { CheckoutQuote } from '@/shared/api/types'
import { LABELS } from '@/shared/constants/labels'
import { VendorStrip } from '@/shared/components/VendorStrip'
import { Button } from '@/shared/components/ui/button'
import { ArrowRight, AlertTriangle } from 'lucide-react'

interface ReviewStepProps {
  quote: CheckoutQuote | null
  isPending: boolean
  hasUnavailableItems?: boolean
  onPlaceOrder: () => void
  onBack: () => void
}

function formatInr(value: number) {
  return `₹${value.toLocaleString('en-IN')}`
}

export function ReviewStep({ quote, isPending, hasUnavailableItems, onPlaceOrder, onBack }: ReviewStepProps) {
  if (!quote) {
    return (
      <div className="space-y-5">
        <div className="border border-line bg-paper/60 px-5 py-8">
          <p className="font-display text-[1.125rem] text-ink">Preparing your summary</p>
          <p className="mt-1 text-[0.875rem] text-ink-muted">
            Calculating shipping and taxes for your order…
          </p>
        </div>
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
          Back to payment
        </Button>
      </div>
    )
  }

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
                <li key={item.id} className="flex items-start justify-between gap-4 text-[0.875rem]">
                  <span className="text-ink">
                    {item.productName}
                    <span className="text-ink-muted"> · Qty {item.quantity}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-ink">
                    {formatInr(item.unitPrice * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[0.875rem]">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Subtotal</dt>
                <dd className="tabular-nums text-ink">{formatInr(vb.subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Shipping</dt>
                <dd className="tabular-nums text-ink">
                  {vb.shippingCost === 0 ? 'Free' : formatInr(vb.shippingCost)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">{vb.tax.igst > 0 ? 'IGST' : 'CGST + SGST'}</dt>
                <dd className="tabular-nums text-ink">{formatInr(vb.tax.total)}</dd>
              </div>
              {vb.discount > 0 && (
                <div className="flex justify-between gap-4 text-success">
                  <dt>Discount</dt>
                  <dd className="tabular-nums">−{formatInr(vb.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4 border-t border-line pt-3 font-medium">
                <dt className="text-ink">Vendor total</dt>
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
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-brand">
              Payable now
            </p>
            <p className="mt-1 text-[0.875rem] text-ink-muted">Including shipping and taxes</p>
          </div>
          <p className="font-display text-[1.75rem] leading-none tabular-nums text-brand">
            {formatInr(quote.grandTotal)}
          </p>
        </div>
        {quote.appliedCoupon && (
          <p className="mt-3 text-[0.8125rem] text-success">
            Coupon {quote.appliedCoupon.code} applied (−{formatInr(quote.appliedCoupon.discount)})
          </p>
        )}
      </div>

      {hasUnavailableItems && (
        <div className="flex items-start gap-2 rounded-sm border border-warning bg-warning-subtle px-4 py-3">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warning" aria-hidden />
          <p className="text-[0.875rem] text-warning-foreground">
            {LABELS.removeUnavailableToCheckout}
          </p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
          Back to payment
        </Button>
        <Button
          size="lg"
          className="w-full gap-2 sm:w-auto"
          onClick={onPlaceOrder}
          loading={isPending}
          disabled={Boolean(hasUnavailableItems)}
        >
          Place order
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  )
}
