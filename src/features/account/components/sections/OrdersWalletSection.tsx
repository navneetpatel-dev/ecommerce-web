'use client'

import Link from 'next/link'
import { ChevronRight, Heart, Package, RotateCcw, Star, Wallet } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { reviewsApi } from '@/features/reviews/api/reviews.api'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useAccountOverview } from '../../hooks/useAccountOverview'
import {
  countOrderItems,
  formatInr,
  formatOrderDate,
  orderItemSummary,
  shortOrderId,
} from '@/features/orders/utils/format'

export function OrdersWalletSection() {
  const {
    recentOrders,
    ordersCount,
    wishlistCount,
    walletBalance,
    recentWalletTx,
    isLoadingStats,
    isLoadingWalletTx,
  } = useAccountOverview()

  const reviewsQuery = useQuery({
    queryKey: ['reviews', 'mine'],
    queryFn: () => reviewsApi.myReviews(),
  })

  const preview = recentOrders.slice(0, 4)

  return (
    <div className="space-y-6">
      <section className="border border-line bg-surface-raised shadow-elevation-1">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2 className="font-display text-[1.125rem] text-ink">Recent orders</h2>
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
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-paper"
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

      <section className="border border-line bg-surface-raised p-5 shadow-elevation-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center border border-line bg-paper text-brand">
              <Wallet size={18} strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                Wallet balance
              </p>
              <p className="mt-0.5 font-display text-[1.375rem] tabular-nums text-ink">
                {isLoadingStats ? '—' : formatInr(walletBalance)}
              </p>
            </div>
          </div>
          <Link
            href="/wallet"
            className="inline-flex items-center gap-1 text-[0.8125rem] font-medium text-brand hover:text-brand-hover"
          >
            Open wallet
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="mt-5 border-t border-line pt-4">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
            Recent activity
          </p>
          {isLoadingWalletTx ? (
            <div className="mt-3 space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : recentWalletTx.length === 0 ? (
            <p className="mt-3 text-[0.875rem] text-ink-muted">No wallet transactions yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {recentWalletTx.map((tx) => (
                <li
                  key={tx.id}
                  className="flex items-center justify-between gap-3 py-2.5 text-[0.875rem]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-ink">{tx.description || tx.referenceType}</p>
                    <p className="mt-0.5 text-[0.75rem] text-ink-faint">
                      {formatOrderDate(tx.createdAt)}
                    </p>
                  </div>
                  <p
                    className={
                      tx.type === 'CREDIT'
                        ? 'shrink-0 tabular-nums text-success'
                        : 'shrink-0 tabular-nums text-ink'
                    }
                  >
                    {tx.type === 'CREDIT' ? '+' : '−'}
                    {formatInr(tx.amount)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <ul className="divide-y divide-line border border-line bg-surface-raised">
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
        <SummaryRow
          icon={RotateCcw}
          label="Returns"
          value="Manage"
          href="/my-returns"
        />
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
        <span className="min-w-0">
          <span className="block text-[0.9375rem] text-ink">{label}</span>
        </span>
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
          className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-paper"
        >
          {inner}
        </Link>
      </li>
    )
  }

  return <li className="flex items-center justify-between gap-3 px-5 py-4">{inner}</li>
}
