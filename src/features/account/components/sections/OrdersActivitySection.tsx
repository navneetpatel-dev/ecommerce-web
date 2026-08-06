'use client'

import Link from 'next/link'
import { ChevronRight, Heart, Package, RotateCcw, Star } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { reviewsApi } from '@/features/reviews/api/reviews.api'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { useAccountOverview } from '../../hooks/useAccountOverview'
import {
  countOrderItems,
  formatInr,
  formatOrderDate,
  orderItemSummary,
  shortOrderId,
} from '@/features/orders/utils/format'

export function OrdersActivitySection() {
  const {
    recentOrders,
    ordersCount,
    wishlistCount,
    isLoadingStats,
  } = useAccountOverview()

  const reviewsQuery = useQuery({
    queryKey: ['reviews', 'mine'],
    queryFn: () => reviewsApi.myReviews(),
  })

  const preview = recentOrders.slice(0, 4)

  return (
    <div className="space-y-6">
      <section className="border border-line bg-surface-raised shadow-elevation-1">
        <div className="flex items-center justify-between border-b border-line px-5 py-4 md:px-6">
          <div>
            <TextEyebrow>Recent</TextEyebrow>
            <h2 className="mt-1 text-[1.0625rem] font-semibold tracking-tight text-ink">
              Orders
            </h2>
            <p className="mt-0.5 text-[0.8125rem] text-ink-muted">
              {isLoadingStats ? 'Loading…' : `${ordersCount} total`}
            </p>
          </div>
          <Link
            href="/orders"
            className="inline-flex items-center gap-1 text-[0.8125rem] font-medium text-brand hover:text-brand-hover"
          >
            View all
            <ChevronRight size={14} />
          </Link>
        </div>

        {isLoadingStats ? (
          <div className="space-y-3 p-5">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : preview.length === 0 ? (
          <p className="px-5 py-10 text-center text-[0.9375rem] text-ink-muted">
            No orders yet.{' '}
            <Link href="/products" className="font-medium text-brand hover:underline">
              Start shopping
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {preview.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-paper md:px-6"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-ink">#{shortOrderId(order.id)}</p>
                    <p className="mt-0.5 truncate text-[0.8125rem] text-ink-muted">
                      {orderItemSummary(order)} · {countOrderItems(order)} items
                    </p>
                    <p className="mt-0.5 text-[0.75rem] text-ink-faint">
                      {formatOrderDate(order.createdAt)}
                    </p>
                  </div>
                  <p className="shrink-0 font-medium tabular-nums text-ink">
                    {formatInr(order.totalAmount)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ul className="divide-y divide-line border border-line bg-surface-raised shadow-elevation-1">
        <SummaryRow
          icon={Heart}
          label="Wishlist"
          value={isLoadingStats ? '—' : String(wishlistCount)}
          href="/wishlist"
        />
        <SummaryRow
          icon={Star}
          label="Your reviews"
          value={reviewsQuery.isLoading ? '—' : String(reviewsQuery.data?.length ?? 0)}
          href="/reviews"
        />
        <SummaryRow icon={RotateCcw} label="Returns" value="Manage" href="/my-returns" />
        <SummaryRow
          icon={Package}
          label="All orders"
          value={isLoadingStats ? '—' : String(ordersCount)}
          href="/orders"
        />
      </ul>
    </div>
  )
}

function SummaryRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Heart
  label: string
  value: string
  href?: string
}) {
  const inner = (
    <>
      <span className="flex min-w-0 items-center gap-3">
        <Icon size={16} strokeWidth={1.5} className="shrink-0 text-ink-muted" aria-hidden />
        <span className="block text-[0.9375rem] text-ink">{label}</span>
      </span>
      <span className="flex items-center gap-2">
        <span className="text-[0.875rem] font-medium tabular-nums text-ink">{value}</span>
        {href ? <ChevronRight size={14} className="text-ink-muted" /> : null}
      </span>
    </>
  )

  if (href) {
    return (
      <li>
        <Link
          href={href}
          className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-paper md:px-6"
        >
          {inner}
        </Link>
      </li>
    )
  }

  return <li className="flex items-center justify-between gap-3 px-5 py-4 md:px-6">{inner}</li>
}
