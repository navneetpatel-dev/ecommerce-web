'use client'

import { RotateCcw } from 'lucide-react'
import { EmptyState } from '@/shared/components/EmptyState'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Badge } from '@/shared/components/ui/badge'
import { formatOrderDate, formatInr } from '@/features/orders/utils/format'
import { useMyReturns } from '../api/returns.queries'

const STATUS_LABEL: Record<string, string> = {
  REQUESTED: 'Requested',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  PICKUP_SCHEDULED: 'Pickup scheduled',
  RECEIVED: 'Received',
  REFUNDED: 'Refunded',
  CLOSED: 'Closed',
}

export function MyReturnsPage() {
  const { data, isLoading, isError, error } = useMyReturns()
  const returns = data ?? []

  return (
    <div className="storefront-container py-8 md:py-10">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-[1.75rem] text-ink md:text-[2rem]">Returns</h1>
        <p className="mt-2 text-[0.9375rem] text-ink-muted">
          Track return requests for delivered items. Start a return from an order detail page when
          an item qualifies.
        </p>
      </header>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : isError ? (
        <p className="border border-line bg-surface-raised px-5 py-10 text-center text-ink-muted">
          {(error as Error)?.message || 'Could not load returns.'}
        </p>
      ) : returns.length === 0 ? (
        <div className="border border-dashed border-line bg-paper/50">
          <EmptyState
            icon={RotateCcw}
            heading="No returns yet"
            message="When you request a return on a delivered order, it will show up here."
            actionLabel="View orders"
            actionTo="/orders"
            className="py-14"
          />
        </div>
      ) : (
        <ul className="divide-y divide-line border border-line bg-surface-raised">
          {returns.map((row) => (
            <li key={row.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <p className="font-medium text-ink">{row.productName || 'Order item'}</p>
                <p className="mt-1 text-[0.8125rem] text-ink-muted">
                  {row.reasonCode.replaceAll('_', ' ')} · {formatOrderDate(row.createdAt)}
                </p>
                <p className="mt-1 text-[0.875rem] text-ink-muted">{row.reason}</p>
                {row.refundAmount != null ? (
                  <p className="mt-1 text-[0.8125rem] tabular-nums text-ink">
                    Refund {formatInr(row.refundAmount)}
                  </p>
                ) : null}
              </div>
              <Badge variant="outline">{STATUS_LABEL[row.status] ?? row.status}</Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
