import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'
import type { WalletTransaction } from '@/shared/api/types'

export const walletApi = {
  getBalance: () => apiClient.get<{ balance: number }>(API.wallet.balance),
  getTransactions: (params?: { limit?: number; offset?: number }) => {
    const q = new URLSearchParams()
    if (params?.limit != null) q.set('limit', String(params.limit))
    if (params?.offset != null) q.set('offset', String(params.offset))
    const qs = q.toString()
    return apiClient.get<{ transactions: WalletTransaction[] }>(
      qs ? `${API.wallet.transactions}?${qs}` : API.wallet.transactions,
    )
  },
}
