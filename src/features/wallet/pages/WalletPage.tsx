'use client'

import { useWalletPage } from '../hooks/useWalletPage'
import { WalletContent } from '../components/WalletContent'

export function WalletPage() {
  const wallet = useWalletPage()

  return (
    <WalletContent
      balance={wallet.balance}
      transactions={wallet.transactions}
      isLoadingBalance={wallet.isLoadingBalance}
      isLoadingTransactions={wallet.isLoadingTransactions}
    />
  )
}
