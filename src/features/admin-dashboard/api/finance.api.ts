import { apiClient } from '@/shared/api/client'
import type { CommissionLedgerEntry, PayoutEntry } from '@/shared/api/types'

export const commissionsApi = {
  list: () => apiClient.get<{ items: CommissionLedgerEntry[]; total: number }>('/api/commissions'),
  vendorSummary: (vendorId: string) =>
    apiClient.get<{ total: number; pending: number; settled: number }>(`/api/commissions/vendor/${vendorId}`),
}

export const payoutsApi = {
  list: () => apiClient.get<{ items: PayoutEntry[]; total: number }>('/api/payouts'),
  process: () => apiClient.post<{ message: string }>('/api/payouts/process', {}),
}
