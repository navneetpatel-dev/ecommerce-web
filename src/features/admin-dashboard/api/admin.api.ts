import { apiClient } from '@/shared/api/client'
import { unwrapPaginatedList, type PaginatedList, type PaginationQuery } from '@/shared/api/pagination'
import { API } from '@/shared/constants/apiRoutes'
import { VENDOR_STATUS, PRODUCT_STATUS } from '@/shared/constants/statuses'
import type { AdminAnalytics, VendorInfo, ProductDetail } from '@/shared/api/types'
import type { Coupon } from '@/shared/api/types'

export const adminApi = {
  dashboard: () =>
    apiClient.get<{
      totalOrders: number
      totalRevenue: number
      totalVendors: number
      totalCustomers: number
      pendingApprovals: number
    }>(API.admin.dashboard),
  pendingVendors: () => apiClient.get<VendorInfo[]>(API.vendors.list(`status=${VENDOR_STATUS.PENDING}`)),
  vendors: async (params: PaginationQuery = {}): Promise<PaginatedList<VendorInfo>> => {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    const res = await apiClient.getWithResponse<VendorInfo[]>(API.vendors.list(q.toString()))
    return unwrapPaginatedList(res)
  },
  approveVendor: (id: string) => apiClient.patch(API.vendors.approve(id), {}),
  rejectVendor: (id: string, reason: string) =>
    apiClient.patch(API.vendors.reject(id), { reason }),
  suspendVendor: (id: string, reason: string) =>
    apiClient.patch(API.vendors.suspend(id), { reason }),
  pendingProducts: () =>
    apiClient.get<ProductDetail[]>(API.products.list(`status=${PRODUCT_STATUS.PENDING_APPROVAL}`)),
  approveProduct: (id: string) => apiClient.post<{ message: string }>(API.products.approve(id), {}),
  rejectProduct: (id: string, rejectionNote: string) =>
    apiClient.post<{ message: string }>(API.products.reject(id), { rejectionNote }),
  archiveProduct: (id: string) => apiClient.post<{ message: string }>(API.products.archive(id), {}),
  coupons: async (page = 1): Promise<PaginatedList<Coupon>> => {
    const res = await apiClient.getWithResponse<Coupon[]>(`${API.coupons.list}?page=${page}`)
    return unwrapPaginatedList(res)
  },
  createCoupon: (body: unknown) => apiClient.post<Coupon>(API.coupons.create, body),
  analytics: () => apiClient.get<AdminAnalytics>(API.admin.analytics),
}
