import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'
import { VENDOR_STATUS, PRODUCT_STATUS } from '@/shared/constants/statuses'
import type { AdminAnalytics, VendorInfo, ProductDetail } from '@/shared/api/types'
import type { Coupon } from '@/shared/api/types'

export const adminApi = {
  dashboard: () => apiClient.get<{ totalOrders: number; totalRevenue: number; totalVendors: number; totalCustomers: number; pendingApprovals: number }>(API.admin.dashboard),
  pendingVendors: () => apiClient.get<VendorInfo[]>(API.vendors.list(`status=${VENDOR_STATUS.PENDING}`)),
  vendors: () => apiClient.get<VendorInfo[]>(API.vendors.list()),
  approveVendor: (id: string) => apiClient.patch(API.vendors.approve(id), {}),
  rejectVendor: (id: string, reason: string) =>
    apiClient.patch(API.vendors.reject(id), { reason }),
  suspendVendor: (id: string) => apiClient.patch(API.vendors.suspend(id), {}),
  pendingProducts: () => apiClient.get<ProductDetail[]>(API.products.list(`status=${PRODUCT_STATUS.PENDING_APPROVAL}`)),
  approveProduct: (id: string) => apiClient.post<{ message: string }>(API.products.approve(id), {}),
  rejectProduct: (id: string, rejectionNote: string) =>
    apiClient.post<{ message: string }>(API.products.reject(id), { rejectionNote }),
  archiveProduct: (id: string) => apiClient.post<{ message: string }>(API.products.archive(id), {}),
  coupons: (page = 1) =>
    apiClient.get<{ items: Coupon[]; total: number }>(`${API.coupons.list}?page=${page}`),
  createCoupon: (body: unknown) => apiClient.post<Coupon>(API.coupons.create, body),
  analytics: () => apiClient.get<AdminAnalytics>(API.admin.analytics),
}
