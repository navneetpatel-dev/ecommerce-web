'use client'

import { useAdminAnalytics } from '../api/admin.queries'

export function useAdminAnalyticsPage() {
  const { data, isLoading } = useAdminAnalytics()
  return {
    data,
    isLoading,
    isEmpty: !isLoading && !data,
  }
}
