'use client'

import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { formatInr } from '../utils/format'
import type { Order } from '@/shared/api/types'

interface OrderPaymentSummaryProps {
  order: Pick<
    Order,
    'totalAmount' | 'walletAmountUsed' | 'pendingCashbackAmount' | 'cashbackCreditedAt' | 'paymentMethod'
  >
  className?: string
}

export function OrderPaymentSummary({ order, className }: OrderPaymentSummaryProps) {
  const walletUsed = Number(order.walletAmountUsed ?? 0)
  const total = Number(order.totalAmount ?? 0)
  const razorpayPaid = Math.max(0, Math.round((total - walletUsed) * 100) / 100)
  const pendingCashback = Number(order.pendingCashbackAmount ?? 0)
  const isCod = order.paymentMethod === 'COD'
  const showSplit = walletUsed > 0 && (razorpayPaid > 0 || isCod)

  if (!showSplit && pendingCashback <= 0 && !order.cashbackCreditedAt) {
    return null
  }

  return (
    <div className={className}>
      {showSplit || walletUsed > 0 ? (
        <div className="space-y-2 text-[0.875rem]">
          <p className="font-medium text-ink">{LABELS.paymentSplitHeading}</p>
          {walletUsed > 0 ? (
            <p className="text-ink-muted">
              {formatLabel(LABELS.paymentSplitWallet, { amount: formatInr(walletUsed) })}
            </p>
          ) : null}
          {razorpayPaid > 0 ? (
            <p className="text-ink-muted">
              {formatLabel(LABELS.paymentSplitRazorpay, { amount: formatInr(razorpayPaid) })}
            </p>
          ) : null}
          {isCod && razorpayPaid <= 0 && walletUsed <= 0 ? (
            <p className="text-ink-muted">{LABELS.paymentSplitCod}</p>
          ) : null}
        </div>
      ) : null}

      {pendingCashback > 0 && !order.cashbackCreditedAt ? (
        <p className="mt-3 text-[0.8125rem] text-brand">{LABELS.cashbackPendingAfterDelivery}</p>
      ) : null}

      {order.cashbackCreditedAt && pendingCashback > 0 ? (
        <p className="mt-3 text-[0.8125rem] text-success">
          {formatLabel(LABELS.cashbackCreditedToWallet, { amount: formatInr(pendingCashback) })}
        </p>
      ) : null}
    </div>
  )
}
