import { apiClient } from '@/shared/api/client'
import type { WalletLedgerEntry } from '@/shared/api/types'

export const walletApi = {
  balance: () => apiClient.get<{ balance: number }>('/api/wallet/balance'),
  transactions: async (page = 1) => {
    const res = await apiClient.getWithResponse<WalletLedgerEntry[]>(
      `/api/wallet/transactions?page=${page}`
    )
    const pagination = res.meta?.pagination as { total?: number } | undefined
    return {
      items: Array.isArray(res.data) ? res.data : [],
      total: pagination?.total ?? (Array.isArray(res.data) ? res.data.length : 0),
    }
  },
}
