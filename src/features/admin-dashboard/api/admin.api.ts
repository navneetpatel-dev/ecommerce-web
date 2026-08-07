import { apiClient } from '@/shared/api/client'
import { unwrapPaginatedList, type PaginatedList, type PaginationQuery } from '@/shared/api/pagination'
import { API } from '@/shared/constants/apiRoutes'
import { VENDOR_STATUS, PRODUCT_STATUS } from '@/shared/constants/statuses'
import type {
  AdminAnalytics,
  VendorInfo,
  ProductDetail,
  Coupon,
  CouponAnalytics,
  CouponBatch,
  BulkGenerateResult,
  CouponStatus,
} from '@/shared/api/types'

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

  vendors: async (
    params: PaginationQuery & { search?: string; status?: string } = {},
  ): Promise<PaginatedList<VendorInfo>> => {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    if (params.search) q.set('search', params.search)
    if (params.status) q.set('status', params.status)
    const res = await apiClient.getWithResponse<VendorInfo[]>(API.vendors.list(q.toString()))
    return unwrapPaginatedList(res)
  },

  approveVendor: (id: string) => apiClient.patch(API.vendors.approve(id), {}),
  rejectVendor: (id: string, reason: string) =>
    apiClient.patch(API.vendors.reject(id), { reason }),
  suspendVendor: (id: string, reason: string) =>
    apiClient.patch(API.vendors.suspend(id), { reason }),

  getVendorDocuments: (vendorId: string) =>
    apiClient.get<
      Array<{
        id: string
        vendorId: string
        type: 'GST_CERT' | 'PAN' | 'BANK_PROOF'
        url: string
        verified: boolean
        createdAt?: string
      }>
    >(API.vendorDocs.list(vendorId)),
  verifyVendorDocument: (documentId: string) =>
    apiClient.patch(API.vendorDocs.verify(documentId), {}),
  rejectVendorDocument: (documentId: string, reason: string) =>
    apiClient.patch<{ id: string; rejected: boolean }>(API.vendorDocs.reject(documentId), {
      reason,
    }),

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

  coupons: async (
    params: PaginationQuery & {
      vendorId?: string | null
      status?: string
      vendorScoped?: boolean
    } = {},
  ): Promise<PaginatedList<Coupon>> => {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    if (params.vendorId) q.set('vendorId', params.vendorId)
    if (params.status) q.set('status', params.status)
    if (params.vendorScoped !== undefined) q.set('vendorScoped', String(params.vendorScoped))
    const qs = q.toString()
    const res = await apiClient.getWithResponse<Coupon[]>(
      qs ? `${API.coupons.list}?${qs}` : API.coupons.list,
    )
    return unwrapPaginatedList(res)
  },

  createCoupon: (body: unknown) => apiClient.post<Coupon>(API.coupons.create, body),
  updateCoupon: (id: string, body: unknown) =>
    apiClient.patch<Coupon>(API.coupons.detail(id), body),
  updateCouponStatus: (id: string, status: CouponStatus) =>
    apiClient.patch<Coupon>(API.coupons.status(id), { status }),
  couponAnalytics: (id: string) =>
    apiClient.get<CouponAnalytics>(API.coupons.analytics(id)),
  bulkGenerateCoupons: (body: unknown) =>
    apiClient.post<BulkGenerateResult>(API.coupons.bulk, body),
  couponBatches: () => apiClient.get<CouponBatch[]>(API.coupons.batches),
  analytics: () => apiClient.get<AdminAnalytics>(API.admin.analytics),
}
