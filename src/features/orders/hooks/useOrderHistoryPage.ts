'use client'

import { useMyOrders } from '../api/orders.queries'
import { useAuthStore } from '@/features/auth/store/auth.store'

export function useOrderHistoryPage() {
  const role = useAuthStore((s) => s.currentUser?.role)
  const { data, isLoading } = useMyOrders(role)

  return {
    isLoading,
    orders: data?.items ?? [],
    isEmpty: !isLoading && !data?.items.length,
  }
}
