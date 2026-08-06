import { useQuery } from '@tanstack/react-query'
import { adminApi } from './admin.api'
import { DEFAULT_PAGE_LIMIT } from '@/shared/constants/pagination'

export function useAdminDashboard() {
  return useQuery({ queryKey: ['admin', 'dashboard'], queryFn: () => adminApi.dashboard() })
}

/** Lightweight fetch for tab badge counts (uses pagination total). */
export function usePendingVendors() {
  return useQuery({
    queryKey: ['admin', 'vendors', 'pending', 'meta'],
    queryFn: () => adminApi.pendingVendors({ page: 1, limit: 1 }),
  })
}

export function usePendingProducts() {
  return useQuery({
    queryKey: ['admin', 'products', 'pending', 'meta'],
    queryFn: () => adminApi.pendingProducts({ page: 1, limit: 1 }),
  })
}

export function useAdminCoupons(page = 1, limit = DEFAULT_PAGE_LIMIT) {
  return useQuery({
    queryKey: ['admin', 'coupons', page, limit],
    queryFn: () => adminApi.coupons({ page, limit }),
  })
}

export function useAdminAnalytics() {
  return useQuery({ queryKey: ['admin', 'analytics'], queryFn: () => adminApi.analytics() })
}
