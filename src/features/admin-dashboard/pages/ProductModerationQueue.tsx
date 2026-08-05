'use client'

import { useProductModerationQueue } from '../hooks/useProductModerationQueue'
import { ProductModerationTable } from '../components/ProductModerationTable'
import { Skeleton } from '@/shared/components/ui/skeleton'

export function ProductModerationQueue() {
  const queue = useProductModerationQueue()

  if (queue.isLoading) return <Skeleton className="h-40 w-full" />
  if (!queue.products?.length) {
    return <p className="text-ink-muted py-8 text-center text-[0.9375rem]">No pending product approvals</p>
  }

  return (
    <ProductModerationTable
      products={queue.products}
      rejectingId={queue.rejectingId}
      rejectNote={queue.rejectNote}
      onRejectNoteChange={queue.onRejectNoteChange}
      onApprove={queue.onApprove}
      onStartReject={queue.onStartReject}
      onSubmitReject={queue.onSubmitReject}
      onCancelReject={queue.onCancelReject}
    />
  )
}
