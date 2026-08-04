import { apiClient } from '@/shared/api/client'
import type { VendorSummary, CommissionLedgerEntry, PayoutEntry, ProductListItem } from '@/shared/api/types'

export const vendorApi = {
  summary: () => apiClient.get<VendorSummary>('/api/vendors/dashboard/summary'),
  products: (page = 1, filters?: { status?: string; search?: string }) => {
    const params = new URLSearchParams({ page: String(page) })
    if (filters?.status) params.set('status', filters.status)
    if (filters?.search) params.set('search', filters.search)
    return apiClient.get<{ items: ProductListItem[]; total: number; totalPages: number }>(
      `/api/products?${params.toString()}`
    )
  },
  commissions: (page = 1) =>
    apiClient.get<{ items: CommissionLedgerEntry[]; total: number }>(`/api/commissions?page=${page}`),
  payouts: (page = 1) =>
    apiClient.get<{ items: PayoutEntry[]; total: number }>(`/api/payouts?page=${page}`),
}
