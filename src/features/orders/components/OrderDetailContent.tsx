import Link from 'next/link'
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react'
import { motion } from 'motion/react'
import type { Order } from '@/shared/api/types'
import { SubOrderCard } from './SubOrderCard'
import { OrderStatusGroup } from './OrderStatusGroup'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { Button } from '@/shared/components/ui/button'
import {
  countOrderItems,
  formatInr,
  formatOrderDate,
  shortOrderId,
} from '../utils/format'

interface OrderDetailContentProps {
  order: Order
}

export function OrderDetailContent({ order }: OrderDetailContentProps) {
  const itemCount = countOrderItems(order)
  const vendorCount = order.subOrders?.length ?? 0
  const address = order.shippingAddress

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
      />

      <div className="storefront-container relative py-6 md:py-8">
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
        >
          <Link
            href="/orders"
            className="mb-4 inline-flex items-center gap-1.5 text-[0.875rem] text-ink-muted transition-colors hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Back to orders
          </Link>

          <TextEyebrow brand>Order details</TextEyebrow>
          <div className="mt-1.5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1
                className="font-display text-ink leading-[1.1] tracking-tight"
                style={{ fontSize: 'var(--text-display-sm)' }}
              >
                Order #{shortOrderId(order.id)}
              </h1>
              <p className="mt-2 text-[0.875rem] text-ink-muted">
                Placed {formatOrderDate(order.createdAt)}
                {vendorCount > 0 && (
                  <>
                    {' · '}
                    {vendorCount} {vendorCount === 1 ? 'seller' : 'sellers'}
                    {' · '}
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </>
                )}
              </p>
              <OrderStatusGroup
                className="mt-4"
                orderStatus={order.status}
                paymentStatus={order.paymentStatus}
              />
            </div>
          </div>
        </motion.header>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:mt-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="space-y-8">
              {(order.subOrders ?? []).map((subOrder, index) => (
                <motion.div
                  key={subOrder.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.28,
                    delay: Math.min(0.04 * index, 0.16),
                    ease: [0.2, 0, 0, 1],
                  }}
                >
                  <SubOrderCard subOrder={subOrder} />
                </motion.div>
              ))}
            </div>

            <div className="mt-6 border-t border-line pt-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-brand transition-colors hover:text-brand-hover"
              >
                Continue shopping
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-[88px] lg:z-10 lg:self-start">
            <div className="relative border border-line bg-surface-raised p-5 shadow-elevation-1">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand via-brand/70 to-transparent"
              />

              <p className="text-[0.875rem] text-ink-muted">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
                <span className="mx-2 text-line">·</span>
                <span className="font-medium text-ink">{formatInr(order.totalAmount)}</span>
              </p>

              <TextEyebrow className="mt-4">Order summary</TextEyebrow>
              <h2 className="mt-1 font-display text-[1.25rem] text-ink">What you paid</h2>

              <dl className="mt-5 space-y-2.5 text-[0.875rem]">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-ink-muted">Items</dt>
                  <dd className="tabular-nums text-ink">{itemCount}</dd>
                </div>
                {Number(order.discountTotal) > 0 && (
                  <div className="flex items-center justify-between gap-4 text-success">
                    <dt>Discount</dt>
                    <dd className="tabular-nums">−{formatInr(order.discountTotal)}</dd>
                  </div>
                )}
                <div className="flex items-end justify-between gap-4 border-t border-line pt-3">
                  <dt className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-brand">
                    Total
                  </dt>
                  <dd className="font-display text-[1.5rem] leading-none tabular-nums text-brand">
                    {formatInr(order.totalAmount)}
                  </dd>
                </div>
              </dl>

              {address && (
                <div className="mt-5 border-t border-line pt-5">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-ink-muted" strokeWidth={1.5} />
                    <TextEyebrow className="!mb-0">Shipping to</TextEyebrow>
                  </div>
                  <address className="mt-2 not-italic text-[0.875rem] leading-relaxed text-ink">
                    <span className="block">{address.line1}</span>
                    {address.line2 ? <span className="block">{address.line2}</span> : null}
                    <span className="block text-ink-muted">
                      {address.city}, {address.state} {address.pincode}
                    </span>
                    <span className="block text-ink-muted">{address.country}</span>
                  </address>
                </div>
              )}

              <div className="mt-5 border-t border-line pt-5">
                <Button className="w-full" asChild>
                  <Link href="/orders">All orders</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
