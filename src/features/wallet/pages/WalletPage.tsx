'use client'
import { useWalletBalance, useWalletTransactions } from '../api/wallet.queries'
import { WalletContent } from '../components/WalletContent'

export function WalletPage() {
  const { data: balance, isLoading: loadingBalance } = useWalletBalance()
  const { data: transactionsData, isLoading: loadingTx } = useWalletTransactions()

  return (
    <WalletContent
      balance={balance}
      transactions={transactionsData?.items}
      isLoadingBalance={loadingBalance}
      isLoadingTransactions={loadingTx}
    />
  )
}
