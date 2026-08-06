import type { SubOrder } from '@/shared/api/types'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { Timeline } from '@/shared/components/Timeline'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { cn } from '@/shared/utils/cn'
import { formatInr } from '../utils/format'
import { buildSubOrderTimeline } from '../utils/timeline'

interface SubOrderCardProps {
  subOrder: SubOrder
}

export function SubOrderCard({ subOrder }: SubOrderCardProps) {
  const timeline = buildSubOrderTimeline(subOrder)
  const showTimeline = subOrder.status !== 'PENDING'
  const shippingCost = Number(subOrder.shippingCost ?? 0)
  const vendorName = subOrder.vendor?.businessName || 'Seller'
  const itemCount = subOrder.items?.length ?? 0

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-2">
        <div className="flex flex-wrap items-baseline gap-2">
          <TextEyebrow className="!mb-0">Sold by</TextEyebrow>
          <h2 className="font-display text-[1.125rem] text-ink">{vendorName}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[0.6875rem] uppercase tracking-wider text-ink-faint">
            {itemCount} {itemCount === 1 ? 'piece' : 'pieces'}
          </span>
          <div className="inline-flex items-center gap-1.5">
            <span className="text-[0.6875rem] font-medium text-ink-faint">Shipment</span>
            <StatusBadge status={subOrder.status} />
          </div>
        </div>
      </div>

      <ul className="divide-y divide-line">
        {subOrder.items?.map((item) => (
          <li
            key={item.id}
            className="flex items-start justify-between gap-4 py-3.5 text-[0.875rem]"
          >
            <div className="min-w-0">
              <p className="font-medium text-ink">{item.productName}</p>
              <p className="mt-0.5 text-[0.8125rem] text-ink-muted">Qty {item.quantity}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-display text-[1.0625rem] tabular-nums text-ink">
                {formatInr(Number(item.unitPrice) * Number(item.quantity))}
              </p>
              {item.quantity > 1 && (
                <p className="mt-0.5 text-[0.75rem] text-ink-muted">
                  {formatInr(Number(item.unitPrice))} each
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-1 space-y-2 border-t border-line pt-4 text-[0.875rem]">
        <div className="flex justify-between gap-4">
          <dt className={shippingCost > 0 ? 'text-ink-muted' : 'font-medium text-ink'}>
            {shippingCost > 0 ? 'Subtotal' : 'Seller total'}
          </dt>
          <dd
            className={cn(
              'tabular-nums',
              shippingCost > 0 ? 'text-ink' : 'font-medium text-ink'
            )}
          >
            {formatInr(subOrder.subtotal)}
          </dd>
        </div>
        {shippingCost > 0 && (
          <>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Shipping</dt>
              <dd className="tabular-nums text-ink">{formatInr(shippingCost)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-line pt-3 font-medium">
              <dt className="text-ink">Seller total</dt>
              <dd className="tabular-nums text-ink">
                {formatInr(Number(subOrder.subtotal) + shippingCost)}
              </dd>
            </div>
          </>
        )}
      </dl>

      {showTimeline && (
        <div className="mt-5 border-t border-line pt-5">
          <TextEyebrow className="mb-3">Progress</TextEyebrow>
          <Timeline steps={timeline} />
        </div>
      )}

      {subOrder.shipment && (
        <div className="mt-4 border-t border-dashed border-line pt-4">
          <TextEyebrow className="mb-2">Tracking</TextEyebrow>
          <p className="text-[0.9375rem] text-ink">{subOrder.shipment.carrier}</p>
          <p className="mt-0.5 font-mono text-[0.8125rem] text-ink-muted">
            {subOrder.shipment.trackingNumber}
          </p>
          <div className="mt-2">
            <StatusBadge status={subOrder.shipment.status} />
          </div>
        </div>
      )}
    </section>
  )
}
