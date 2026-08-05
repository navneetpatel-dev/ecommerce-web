'use client'

import { useVendorApprovalQueue } from '../hooks/useVendorApprovalQueue'
import { VendorApprovalTable } from '../components/VendorApprovalTable'
import { Skeleton } from '@/shared/components/ui/skeleton'

export function VendorApprovalQueue() {
  const queue = useVendorApprovalQueue()

  if (queue.isLoading) return <Skeleton className="h-40 w-full" />
  if (!queue.vendors?.length) {
    return <p className="text-ink-muted py-8 text-center text-[0.9375rem]">No pending vendor approvals</p>
  }

  return (
    <VendorApprovalTable
      vendors={queue.vendors}
      rejectingId={queue.rejectingId}
      rejectReason={queue.rejectReason}
      onRejectReasonChange={queue.onRejectReasonChange}
      onApprove={queue.onApprove}
      onStartReject={queue.onStartReject}
      onSubmitReject={queue.onSubmitReject}
      onCancelReject={queue.onCancelReject}
      isApproving={queue.isApproving}
    />
  )
}
