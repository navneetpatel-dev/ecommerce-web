'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import type { Order } from '@/shared/api/types'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { PaginationContainer } from '@/shared/containers/PaginationContainer'
import { OrderStatusGroup } from './OrderStatusGroup'
import {
  countOrderItems,
  formatInr,
  formatOrderDate,
  orderItemSummary,
  shortOrderId,
} from '../utils/format'

interface OrdersListProps {
  orders: Order[]
  pagination?: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
  }
}

export function OrdersList({ orders, pagination }: OrdersListProps) {
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
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <TextEyebrow brand>Account</TextEyebrow>
            <h1
              className="mt-1.5 font-display text-ink leading-[1.1] tracking-tight"
              style={{ fontSize: 'var(--text-display-sm)' }}
            >
              Your Orders
            </h1>
            <p className="mt-2 max-w-xl text-[0.9375rem] text-ink-muted">
              Track each seller&apos;s package separately — multi-vendor orders ship on their own
              timelines.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-brand transition-colors hover:text-brand-hover"
          >
            Continue shopping
            <ArrowRight size={15} />
          </Link>
        </motion.header>

        {/* Column labels — desktop ledger header */}
        <div className="mt-8 hidden border-b border-line pb-2 md:grid md:grid-cols-[7rem_8rem_minmax(0,1fr)_7rem_minmax(9rem,auto)_1.5rem] md:gap-4">
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
            Order
          </span>
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
            Placed
          </span>
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
            Items
          </span>
          <span className="text-right text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
            Total
          </span>
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
            Status
          </span>
          <span className="sr-only">Open</span>
        </div>

        <ul className="divide-y divide-line border-b border-line">
          {orders.map((order, index) => {
            const itemCount = countOrderItems(order)
            const vendorCount = order.subOrders?.length ?? 0

            return (
              <motion.li
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.28,
                  delay: Math.min(index * 0.03, 0.15),
                  ease: [0.2, 0, 0, 1],
                }}
              >
                <Link
                  href={`/orders/${order.id}`}
                  className="group grid grid-cols-1 gap-3 py-4 transition-colors hover:bg-brand-subtle/40 md:grid-cols-[7rem_8rem_minmax(0,1fr)_7rem_minmax(9rem,auto)_1.5rem] md:items-center md:gap-4"
                >
                  <div className="flex items-center justify-between gap-2 md:block">
                    <span className="font-mono text-[0.8125rem] text-ink">
                      #{shortOrderId(order.id)}
                    </span>
                    <ChevronRight
                      className="h-4 w-4 text-ink-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand md:hidden"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </div>

                  <div className="text-[0.8125rem] text-ink-muted">
                    {formatOrderDate(order.createdAt)}
                    <span className="md:hidden">
                      {' · '}
                      {vendorCount} {vendorCount === 1 ? 'seller' : 'sellers'}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[0.9375rem] text-ink group-hover:text-brand">
                      {orderItemSummary(order)}
                    </p>
                    <p className="mt-0.5 hidden text-[0.75rem] text-ink-faint md:block">
                      {vendorCount} {vendorCount === 1 ? 'seller' : 'sellers'}
                      {' · '}
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>

                  <p className="font-display text-[1.125rem] tabular-nums text-ink md:text-right">
                    {formatInr(order.totalAmount)}
                  </p>

                  <OrderStatusGroup
                    orderStatus={order.status}
                    paymentStatus={order.paymentStatus}
                    density="compact"
                  />

                  <ChevronRight
                    className="hidden h-4 w-4 justify-self-end text-ink-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand md:block"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </Link>
              </motion.li>
            )
          })}
        </ul>

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8">
            <PaginationContainer
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.onPageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}
