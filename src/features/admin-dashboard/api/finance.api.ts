import { apiClient } from '@/shared/api/client'
import { unwrapPaginatedList, type PaginatedList, type PaginationQuery } from '@/shared/api/pagination'
import { API } from '@/shared/constants/apiRoutes'
import type { CommissionLedgerEntry, PayoutEntry } from '@/shared/api/types'

export const commissionsApi = {
  list: async (params: PaginationQuery = {}): Promise<PaginatedList<CommissionLedgerEntry>> => {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    const qs = q.toString()
    const res = await apiClient.getWithResponse<CommissionLedgerEntry[]>(
      qs ? `${API.commissions.list}?${qs}` : API.commissions.list,
    )
    return unwrapPaginatedList(res)
  },
  vendorSummary: (vendorId: string) =>
    apiClient.get<{ total: number; pending: number; settled: number }>(API.commissions.vendor(vendorId)),
}

export const payoutsApi = {
  list: async (params: PaginationQuery = {}): Promise<PaginatedList<PayoutEntry>> => {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    const qs = q.toString()
    const res = await apiClient.getWithResponse<PayoutEntry[]>(
      qs ? `${API.payouts.list}?${qs}` : API.payouts.list,
    )
    return unwrapPaginatedList(res)
  },
  process: () => apiClient.post<PayoutEntry[]>(API.payouts.process, {}),
}
