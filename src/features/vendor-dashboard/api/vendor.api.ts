import { apiClient } from '@/shared/api/client'
import { unwrapPaginatedList, type PaginatedList } from '@/shared/api/pagination'
import { API } from '@/shared/constants/apiRoutes'
import type { VendorSummary, CommissionLedgerEntry, PayoutEntry, ProductListItem } from '@/shared/api/types'

export const vendorApi = {
  summary: () => apiClient.get<VendorSummary>(API.vendors.dashboardSummary),
  products: (page = 1, filters?: { status?: string; search?: string }) => {
    const params = new URLSearchParams({ page: String(page) })
    if (filters?.status) params.set('status', filters.status)
    if (filters?.search) params.set('search', filters.search)
    return apiClient.get<{ items: ProductListItem[]; total: number; totalPages: number }>(
      API.products.list(params.toString())
    )
  },
  commissions: async (page = 1): Promise<PaginatedList<CommissionLedgerEntry>> => {
    const res = await apiClient.getWithResponse<CommissionLedgerEntry[]>(
      `${API.commissions.list}?page=${page}`,
    )
    return unwrapPaginatedList(res)
  },
  payouts: async (page = 1): Promise<PaginatedList<PayoutEntry>> => {
    const res = await apiClient.getWithResponse<PayoutEntry[]>(`${API.payouts.list}?page=${page}`)
    return unwrapPaginatedList(res)
  },
}
