import { apiClient } from '@/shared/api/client'
import type { CommissionLedgerEntry, PayoutEntry } from '@/shared/api/types'

export const commissionsApi = {
  list: () => apiClient.get<CommissionLedgerEntry[]>('/api/commissions'),
  vendorSummary: (vendorId: string) =>
    apiClient.get<{ total: number; pending: number; settled: number }>(`/api/commissions/vendor/${vendorId}`),
}

export const payoutsApi = {
  list: () => apiClient.get<PayoutEntry[]>('/api/payouts'),
  process: () => apiClient.post<PayoutEntry[]>('/api/payouts/process', {}),
}
