import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'
import type { CommissionLedgerEntry, PayoutEntry } from '@/shared/api/types'

export const commissionsApi = {
  list: () => apiClient.get<CommissionLedgerEntry[]>(API.commissions.list),
  vendorSummary: (vendorId: string) =>
    apiClient.get<{ total: number; pending: number; settled: number }>(API.commissions.vendor(vendorId)),
}

export const payoutsApi = {
  list: () => apiClient.get<PayoutEntry[]>(API.payouts.list),
  process: () => apiClient.post<PayoutEntry[]>(API.payouts.process, {}),
}
