'use client'
import { usePendingProducts } from '../api/admin.queries'
import { useProductModeration } from '../hooks/useProductModeration'
import { ProductModerationTable } from '../components/ProductModerationTable'
import { Skeleton } from '@/shared/components/ui/skeleton'

export function ProductModerationQueue() {
  const { data: products, isLoading } = usePendingProducts()
  const { rejectingId, rejectNote, setRejectNote, approve, startReject, cancelReject, submitReject } = useProductModeration()

  if (isLoading) return <Skeleton className="h-40 w-full" />
  if (!products?.length) return <p className="text-ink/50 py-8 text-center">No pending product approvals</p>

  return (
    <ProductModerationTable
      products={products}
      rejectingId={rejectingId}
      rejectNote={rejectNote}
      onRejectNoteChange={setRejectNote}
      onApprove={(id) => approve.mutate(id)}
      onStartReject={startReject}
      onSubmitReject={submitReject}
      onCancelReject={cancelReject}
    />
  )
}
