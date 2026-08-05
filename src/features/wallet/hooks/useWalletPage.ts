'use client'

import { useWalletBalance, useWalletTransactions } from '../api/wallet.queries'

export function useWalletPage() {
  const { data: balance, isLoading: loadingBalance } = useWalletBalance()
  const { data: transactionsData, isLoading: loadingTx } = useWalletTransactions()

  return {
    balance,
    transactions: transactionsData?.items,
    isLoadingBalance: loadingBalance,
    isLoadingTransactions: loadingTx,
  }
}
