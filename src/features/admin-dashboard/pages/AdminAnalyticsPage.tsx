'use client'

import { useAdminAnalyticsPage } from '../hooks/useAdminAnalyticsPage'
import { AdminAnalyticsLayout } from '../components/AdminAnalyticsLayout'
import { Skeleton } from '@/shared/components/ui/skeleton'

export function AdminAnalyticsPage() {
  const page = useAdminAnalyticsPage()

  if (page.isLoading) return <Skeleton className="h-96 w-full" />
  if (page.isEmpty || !page.data) {
    return <p className="text-ink-muted text-[0.9375rem]">No analytics data available</p>
  }

  return <AdminAnalyticsLayout data={page.data} />
}
