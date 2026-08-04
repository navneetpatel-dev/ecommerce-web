import { useQuery } from '@tanstack/react-query'
import { walletApi } from './wallet.api'

export function useWalletBalance() {
  return useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: () => walletApi.balance().then((d) => d.balance),
  })
}

export function useWalletTransactions(page = 1) {
  return useQuery({
    queryKey: ['wallet', 'transactions', page],
    queryFn: () => walletApi.transactions(page),
  })
}
