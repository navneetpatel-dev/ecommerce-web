'use client'
import { useAdminAnalytics } from '../api/admin.queries'
import { AdminAnalyticsLayout } from '../components/AdminAnalyticsLayout'
import { Skeleton } from '@/shared/components/ui/skeleton'

export function AdminAnalyticsPage() {
  const { data, isLoading } = useAdminAnalytics()

  if (isLoading) return <Skeleton className="h-96 w-full" />
  if (!data) return <p className="text-ink/50">No analytics data available</p>

  return <AdminAnalyticsLayout data={data} />
}
