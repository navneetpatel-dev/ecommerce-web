import { apiClient } from '@/shared/api/client'
import type { WalletLedgerEntry } from '@/shared/api/types'

export const walletApi = {
  balance: () => apiClient.get<{ balance: number }>('/api/wallet/balance'),
  transactions: (page = 1) =>
    apiClient.get<{ items: WalletLedgerEntry[]; total: number }>(`/api/wallet/transactions?page=${page}`),
}
