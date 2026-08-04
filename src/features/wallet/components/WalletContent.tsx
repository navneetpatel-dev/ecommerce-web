import { BalanceCard } from './BalanceCard'
import { TransactionList } from './TransactionList'

interface WalletContentProps {
  balance?: number
  transactions?: any[]
  isLoadingBalance: boolean
  isLoadingTransactions: boolean
}

export function WalletContent({ balance, transactions, isLoadingBalance, isLoadingTransactions }: WalletContentProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="font-display text-2xl font-semibold">Wallet</h1>
      <BalanceCard balance={balance} isLoading={isLoadingBalance} />
      <div>
        <h2 className="font-semibold mb-3">Transactions</h2>
        <TransactionList transactions={transactions} isLoading={isLoadingTransactions} />
      </div>
    </div>
  )
}
