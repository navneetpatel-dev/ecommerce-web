import { apiClient } from '@/shared/api/client'
import type { AdminAnalytics, VendorInfo, ProductDetail } from '@/shared/api/types'
import type { Coupon } from '@/shared/api/types'

export const adminApi = {
  dashboard: () => apiClient.get<{ totalOrders: number; totalRevenue: number; totalVendors: number; totalCustomers: number; pendingApprovals: number }>('/api/admin/dashboard'),
  pendingVendors: () => apiClient.get<VendorInfo[]>('/api/vendors?status=PENDING'),
  approveVendor: (id: string) => apiClient.patch(`/api/vendors/${id}/approve`, {}),
  rejectVendor: (id: string, reason: string) =>
    apiClient.patch(`/api/vendors/${id}/reject`, { reason }),
  suspendVendor: (id: string) => apiClient.patch(`/api/vendors/${id}/suspend`, {}),
  pendingProducts: () => apiClient.get<ProductDetail[]>('/api/products?status=PENDING_APPROVAL'),
  approveProduct: (id: string) => apiClient.post<{ message: string }>(`/api/products/${id}/approve`, {}),
  rejectProduct: (id: string, rejectionNote: string) =>
    apiClient.post<{ message: string }>(`/api/products/${id}/reject`, { rejectionNote }),
  archiveProduct: (id: string) => apiClient.post<{ message: string }>(`/api/products/${id}/archive`, {}),
  coupons: (page = 1) =>
    apiClient.get<{ items: Coupon[]; total: number }>(`/api/coupons?page=${page}`),
  createCoupon: (body: unknown) => apiClient.post<Coupon>('/api/coupons', body),
  analytics: () => apiClient.get<AdminAnalytics>('/api/admin/analytics/platform'),
}
