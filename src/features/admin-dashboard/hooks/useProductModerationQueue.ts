'use client'

import { usePendingProducts } from '../api/admin.queries'
import { useProductModeration } from './useProductModeration'

export function useProductModerationQueue() {
  const { data: products, isLoading } = usePendingProducts()
  const moderation = useProductModeration()

  return {
    products,
    isLoading,
    rejectingId: moderation.rejectingId,
    rejectNote: moderation.rejectNote,
    onRejectNoteChange: moderation.setRejectNote,
    onApprove: (id: string) => moderation.approve.mutate(id),
    onStartReject: moderation.startReject,
    onSubmitReject: moderation.submitReject,
    onCancelReject: moderation.cancelReject,
  }
}
