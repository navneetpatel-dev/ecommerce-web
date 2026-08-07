'use client'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'

interface WalletApplySectionProps {
  walletBalance: number
  maxApplicable: number
  walletAmountToUse: number
  amountDue: number
  disabled?: boolean
  codSelected?: boolean
  onAmountChange: (amount: number) => void
}

function formatInr(value: number) {
  return `₹${value.toLocaleString('en-IN')}`
}

export function WalletApplySection({
  walletBalance,
  maxApplicable,
  walletAmountToUse,
  amountDue,
  disabled,
  codSelected,
  onAmountChange,
}: WalletApplySectionProps) {
  if (walletBalance <= 0) return null

  const clampAmount = (raw: number) => {
    const n = Number.isFinite(raw) ? raw : 0
    return Math.max(0, Math.min(n, maxApplicable))
  }

  return (
    <div className="space-y-3 border border-line bg-paper/40 p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[0.8125rem] font-medium text-ink">{LABELS.walletBalance}</p>
          <p className="mt-0.5 font-display text-[1.25rem] tabular-nums text-brand">
            {formatInr(walletBalance)}
          </p>
        </div>
        {!codSelected && maxApplicable > 0 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => onAmountChange(maxApplicable)}
          >
            {LABELS.walletUseAll}
          </Button>
        ) : null}
      </div>

      {codSelected ? (
        <p className="text-[0.8125rem] text-ink-muted">{LABELS.walletNotAvailableWithCod}</p>
      ) : (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="wallet-amount">{LABELS.walletAmountToApply}</Label>
            <Input
              id="wallet-amount"
              type="number"
              min={0}
              max={maxApplicable}
              step="0.01"
              value={walletAmountToUse || ''}
              disabled={disabled}
              onChange={(e) => onAmountChange(clampAmount(Number(e.target.value)))}
            />
            <p className="text-[0.75rem] text-ink-muted">
              {formatLabel(LABELS.walletRemainderDue, { amount: formatInr(amountDue) })}
            </p>
          </div>
          {amountDue <= 0 && walletAmountToUse > 0 ? (
            <p className="text-[0.8125rem] font-medium text-success">{LABELS.walletFullyCoversOrder}</p>
          ) : null}
        </>
      )}
    </div>
  )
}
