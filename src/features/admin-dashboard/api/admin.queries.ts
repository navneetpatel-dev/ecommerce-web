import { useQuery } from '@tanstack/react-query'
import { adminApi } from './admin.api'

export function useAdminDashboard() {
  return useQuery({ queryKey: ['admin', 'dashboard'], queryFn: () => adminApi.dashboard() })
}

export function usePendingVendors() {
  return useQuery({ queryKey: ['admin', 'vendors', 'pending'], queryFn: () => adminApi.pendingVendors() })
}

export function usePendingProducts() {
  return useQuery({ queryKey: ['admin', 'products', 'pending'], queryFn: () => adminApi.pendingProducts() })
}

export function useAdminCoupons(page = 1) {
  return useQuery({ queryKey: ['admin', 'coupons', page], queryFn: () => adminApi.coupons(page) })
}

export function useAdminAnalytics() {
  return useQuery({ queryKey: ['admin', 'analytics'], queryFn: () => adminApi.analytics() })
}
