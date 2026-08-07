'use client'

import { LABELS } from '@/shared/constants/labels'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { useWalletBalance, useWalletTransactions } from '../api/wallet.queries'
import { WalletBalanceCard, WalletTransactionsList } from '../components/WalletPageContent'

export function WalletPage() {
  const balanceQuery = useWalletBalance()
  const transactionsQuery = useWalletTransactions()

  const balance = balanceQuery.data?.balance ?? 0
  const transactions = transactionsQuery.data?.transactions ?? []

  return (
    <div className="storefront-container py-8 md:py-10">
      <header className="mb-8 max-w-2xl">
        <TextEyebrow brand>{LABELS.account}</TextEyebrow>
        <h1
          className="mt-1.5 font-display text-ink leading-[1.1] tracking-tight"
          style={{ fontSize: 'var(--text-display-sm)' }}
        >
          {LABELS.wallet}
        </h1>
        <p className="mt-2 text-[0.9375rem] text-ink-muted">{LABELS.walletPageDescription}</p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <WalletBalanceCard balance={balance} isLoading={balanceQuery.isLoading} />
        </div>
        <div className="lg:col-span-7">
          <TextEyebrow className="mb-3">{LABELS.walletTransactionHistory}</TextEyebrow>
          <WalletTransactionsList
            transactions={transactions}
            isLoading={transactionsQuery.isLoading}
          />
        </div>
      </div>
    </div>
  )
}
