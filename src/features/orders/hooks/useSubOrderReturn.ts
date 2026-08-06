'use client'

import { useState } from 'react'
import { useCreateReturn } from '@/features/returns/api/returns.queries'
import { LABELS } from '@/shared/constants/labels'
import { RETURN_REASON, type ReturnReason } from '@/shared/constants/statuses'
import type { OrderItem } from '@/shared/api/types'

const REASON_CODES = [
  { value: RETURN_REASON.DAMAGED, label: LABELS.returnReasonDamaged },
  { value: RETURN_REASON.WRONG_ITEM, label: LABELS.returnReasonWrongItem },
  { value: RETURN_REASON.NOT_AS_DESCRIBED, label: LABELS.returnReasonNotAsDescribed },
  { value: RETURN_REASON.NO_LONGER_NEEDED, label: LABELS.returnReasonNoLongerNeeded },
  { value: RETURN_REASON.OTHER, label: LABELS.returnReasonOther },
] as const

export type ReturnReasonCode = ReturnReason

export { REASON_CODES }

export function useSubOrderReturn() {
  const [target, setTarget] = useState<OrderItem | null>(null)
  const [reasonCode, setReasonCode] = useState<ReturnReasonCode>(RETURN_REASON.DAMAGED)
  const [reason, setReason] = useState('')
  const createReturn = useCreateReturn()

  const openDialog = (item: OrderItem) => {
    setTarget(item)
    setReason('')
    setReasonCode(RETURN_REASON.DAMAGED)
    createReturn.reset()
  }

  const closeDialog = () => setTarget(null)

  const submitReturn = async () => {
    if (!target) return
    await createReturn.mutateAsync({
      orderItemId: target.id,
      reasonCode,
      reason: reason.trim(),
    })
    setTarget(null)
  }

  return {
    target,
    reasonCode,
    setReasonCode,
    reason,
    setReason,
    openDialog,
    closeDialog,
    submitReturn,
    isPending: createReturn.isPending,
    isSuccess: createReturn.isSuccess,
    error: createReturn.error as Error | null,
    reset: createReturn.reset,
  }
}
