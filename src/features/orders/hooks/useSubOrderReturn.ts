'use client'

import { useState } from 'react'
import { useCreateReturn } from '@/features/returns/api/returns.queries'
import type { OrderItem } from '@/shared/api/types'

const REASON_CODES = [
  { value: 'DAMAGED', label: 'Damaged' },
  { value: 'WRONG_ITEM', label: 'Wrong item' },
  { value: 'NOT_AS_DESCRIBED', label: 'Not as described' },
  { value: 'NO_LONGER_NEEDED', label: 'No longer needed' },
  { value: 'OTHER', label: 'Other' },
] as const

export type ReturnReasonCode = (typeof REASON_CODES)[number]['value']

export { REASON_CODES }

export function useSubOrderReturn() {
  const [target, setTarget] = useState<OrderItem | null>(null)
  const [reasonCode, setReasonCode] = useState<ReturnReasonCode>('DAMAGED')
  const [reason, setReason] = useState('')
  const createReturn = useCreateReturn()

  const openDialog = (item: OrderItem) => {
    setTarget(item)
    setReason('')
    setReasonCode('DAMAGED')
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
