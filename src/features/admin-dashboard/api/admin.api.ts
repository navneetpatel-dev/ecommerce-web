import { apiClient } from '@/shared/api/client'
import { unwrapPaginatedList, type PaginatedList, type PaginationQuery } from '@/shared/api/pagination'
import { API } from '@/shared/constants/apiRoutes'
import { VENDOR_STATUS, PRODUCT_STATUS } from '@/shared/constants/statuses'
import type { AdminAnalytics, VendorInfo, ProductDetail, Coupon } from '@/shared/api/types'

function withPaginationQuery(base: string, params: PaginationQuery = {}) {
  const q = new URLSearchParams(base.includes('?') ? base.split('?')[1] : '')
  const path = base.includes('?') ? base.split('?')[0]! : base
  if (params.page) q.set('page', String(params.page))
  if (params.limit) q.set('limit', String(params.limit))
  const qs = q.toString()
  return qs ? `${path}?${qs}` : path
}

export const adminApi = {
  dashboard: () =>
    apiClient.get<{
      totalOrders: number
      totalRevenue: number
      totalVendors: number
      totalCustomers: number
      pendingApprovals: number
    }>(API.admin.dashboard),

  pendingVendors: async (params: PaginationQuery = {}): Promise<PaginatedList<VendorInfo>> => {
    const q = new URLSearchParams({ status: VENDOR_STATUS.PENDING })
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    const res = await apiClient.getWithResponse<VendorInfo[]>(API.vendors.list(q.toString()))
    return unwrapPaginatedList(res)
  },

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

  pendingProducts: async (params: PaginationQuery = {}): Promise<PaginatedList<ProductDetail>> => {
    const q = new URLSearchParams({ status: PRODUCT_STATUS.PENDING_APPROVAL })
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    const res = await apiClient.getWithResponse<ProductDetail[]>(API.products.list(q.toString()))
    return unwrapPaginatedList(res)
  },

  approveProduct: (id: string) => apiClient.post<{ message: string }>(API.products.approve(id), {}),
  rejectProduct: (id: string, rejectionNote: string) =>
    apiClient.post<{ message: string }>(API.products.reject(id), { rejectionNote }),
  archiveProduct: (id: string) => apiClient.post<{ message: string }>(API.products.archive(id), {}),

  coupons: async (params: PaginationQuery = {}): Promise<PaginatedList<Coupon>> => {
    const res = await apiClient.getWithResponse<Coupon[]>(
      withPaginationQuery(API.coupons.list, params),
    )
    return unwrapPaginatedList(res)
  },

  createCoupon: (body: unknown) => apiClient.post<Coupon>(API.coupons.create, body),
  analytics: () => apiClient.get<AdminAnalytics>(API.admin.analytics),
}
