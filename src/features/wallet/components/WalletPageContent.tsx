'use client'

import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { formatInr, formatOrderDate } from '@/features/orders/utils/format'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { Skeleton } from '@/shared/components/ui/skeleton'
import type { WalletTransaction } from '@/shared/api/types'

function transactionSourceLabel(row: WalletTransaction): string {
  const ref = (row.referenceType ?? '').toUpperCase()
  const desc = (row.description ?? '').toLowerCase()
  if (ref.includes('RETURN') || desc.includes('refund')) return LABELS.walletTransactionSourceCodRefund
  if (ref.includes('CASHBACK') || desc.includes('cashback')) return LABELS.walletTransactionSourceCashback
  if (row.type === 'DEBIT' || desc.includes('checkout') || desc.includes('order'))
    return LABELS.walletTransactionSourceCheckout
  if (ref.includes('CLAWBACK') || desc.includes('clawback')) return LABELS.walletTransactionSourceClawback
  return LABELS.walletTransactionSourceOther
}

interface WalletTransactionsListProps {
  transactions: WalletTransaction[]
  isLoading?: boolean
}

export function WalletTransactionsList({ transactions, isLoading }: WalletTransactionsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <p className="border border-line bg-surface-raised px-5 py-10 text-center text-[0.9375rem] text-ink-muted">
        {LABELS.walletNoTransactions}
      </p>
    )
  }

  return (
    <ul className="divide-y divide-line border border-line bg-surface-raised">
      {transactions.map((row) => {
        const isCredit = row.type === 'CREDIT'
        const signedAmount = `${isCredit ? '+' : '−'}${formatInr(row.amount)}`
        return (
          <li key={row.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <p className="font-medium text-ink">{transactionSourceLabel(row)}</p>
              {row.description ? (
                <p className="mt-1 text-[0.8125rem] text-ink-muted">{row.description}</p>
              ) : null}
              <p className="mt-1 text-[0.75rem] text-ink-faint">{formatOrderDate(row.createdAt)}</p>
            </div>
            <div className="text-right">
              <p
                className={`text-[0.9375rem] font-semibold tabular-nums ${
                  isCredit ? 'text-success' : 'text-ink'
                }`}
              >
                {signedAmount}
              </p>
              <p className="mt-0.5 text-[0.75rem] tabular-nums text-ink-muted">
                {formatLabel(LABELS.walletBalanceAfter, { amount: formatInr(row.balanceAfter) })}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

interface WalletBalanceCardProps {
  balance: number
  isLoading?: boolean
}

export function WalletBalanceCard({ balance, isLoading }: WalletBalanceCardProps) {
  return (
    <div className="relative border border-line bg-surface-raised p-5 shadow-elevation-1 md:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand via-brand/70 to-transparent"
      />
      <TextEyebrow brand>{LABELS.wallet}</TextEyebrow>
      {isLoading ? (
        <Skeleton className="mt-3 h-10 w-40" />
      ) : (
        <p className="mt-2 font-display text-[2rem] leading-none tabular-nums text-brand">
          {formatInr(balance)}
        </p>
      )}
      <p className="mt-3 text-[0.875rem] text-ink-muted">{LABELS.walletPageDescription}</p>
    </div>
  )
}
