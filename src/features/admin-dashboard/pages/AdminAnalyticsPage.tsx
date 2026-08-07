'use client'

import { useAdminAnalyticsPage } from '../hooks/useAdminAnalyticsPage'
import { AdminAnalyticsLayout } from '../components/AdminAnalyticsLayout'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { LABELS } from '@/shared/constants/labels'

export function AdminAnalyticsPage() {
  const page = useAdminAnalyticsPage()

  if (page.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full rounded-md" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-md" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-md" />
      </div>
    )
  }

  if (page.isEmpty || !page.data) {
    return <p className="text-[0.9375rem] text-ink-muted">{LABELS.analyticsNoData}</p>
  }

  return <AdminAnalyticsLayout data={page.data} />
}
