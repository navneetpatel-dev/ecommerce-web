'use client'

import Link from 'next/link'
import { AlertTriangle, ClipboardList, Store, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'
import { cn } from '@/shared/utils/cn'

interface AnalyticsOpsQueuesProps {
  pendingProducts: number
  pendingVendors: number
  pendingReviews: number
}

const queues = [
  {
    key: 'products' as const,
    label: LABELS.analyticsPendingProducts,
    href: PATHS.admin.products,
    icon: ClipboardList,
  },
  {
    key: 'vendors' as const,
    label: LABELS.analyticsPendingVendors,
    href: PATHS.admin.vendors,
    icon: Store,
  },
  {
    key: 'reviews' as const,
    label: LABELS.analyticsPendingReviews,
    href: PATHS.admin.reviews,
    icon: Star,
  },
]

export function AnalyticsOpsQueues({
  pendingProducts,
  pendingVendors,
  pendingReviews,
}: AnalyticsOpsQueuesProps) {
  const counts = {
    products: pendingProducts,
    vendors: pendingVendors,
    reviews: pendingReviews,
  }
  const total = pendingProducts + pendingVendors + pendingReviews

  return (
    <Card
      className={cn(
        'overflow-hidden',
        total > 0 ? 'border-warning/30 bg-gradient-to-r from-warning-subtle/40 to-surface' : '',
      )}
    >
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle
            className={cn('h-4 w-4', total > 0 ? 'text-warning' : 'text-ink-faint')}
            aria-hidden
          />
          <CardTitle className="text-[1.0625rem]">{LABELS.analyticsOpsQueues}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          {queues.map((queue) => {
            const Icon = queue.icon
            const count = counts[queue.key]
            return (
              <Link
                key={queue.key}
                href={queue.href}
                className="group flex items-center justify-between gap-3 rounded-md border border-line bg-surface/80 px-4 py-3 transition-colors hover:border-brand/35 hover:bg-brand-subtle/40"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-paper text-ink-muted group-hover:text-brand">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="truncate text-[0.875rem] text-ink-muted">{queue.label}</span>
                </div>
                <span className="font-mono text-[1.125rem] font-semibold text-ink">{count}</span>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
