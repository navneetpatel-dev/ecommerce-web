import type { WalletLedgerEntry } from '@/shared/api/types'
import { SkeletonRows } from '@/shared/components/Skeletons'
import { EmptyState } from '@/shared/components/EmptyState'

interface TransactionListProps {
  transactions: WalletLedgerEntry[] | undefined
  isLoading: boolean
}

export function TransactionList({ transactions, isLoading }: TransactionListProps) {
  if (isLoading) return <SkeletonRows count={3} height="h-12 w-full" />
  if (!transactions?.length) return <EmptyState message="No transactions yet" />

  return (
    <div className="space-y-1">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex justify-between items-center py-2 border-b border-line last:border-0">
          <div>
            <p className="text-[0.9375rem]">{tx.description}</p>
            <p className="text-[0.8125rem] text-ink-muted">{new Date(tx.createdAt).toLocaleDateString()}</p>
          </div>
          <span className={`font-mono text-[0.9375rem] font-medium ${tx.type === 'CREDIT' ? 'text-success' : 'text-danger'}`}>
            {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount}
          </span>
        </div>
      ))}
    </div>
  )
}
