import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { walletApi } from './wallet.api'

export const walletKeys = {
  all: ['wallet'] as const,
  balance: () => [...walletKeys.all, 'balance'] as const,
  transactions: (limit?: number) => [...walletKeys.all, 'transactions', limit] as const,
}

export function useWalletBalance() {
  const currentUser = useAuthStore((s) => s.currentUser)
  return useQuery({
    queryKey: walletKeys.balance(),
    queryFn: () => walletApi.getBalance(),
    enabled: Boolean(currentUser),
  })
}

export function useWalletTransactions(limit = 50) {
  const currentUser = useAuthStore((s) => s.currentUser)
  return useQuery({
    queryKey: walletKeys.transactions(limit),
    queryFn: () => walletApi.getTransactions({ limit }),
    enabled: Boolean(currentUser),
  })
}
