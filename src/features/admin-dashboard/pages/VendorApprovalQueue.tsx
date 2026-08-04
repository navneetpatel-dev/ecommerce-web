'use client'
import { usePendingVendors } from '../api/admin.queries'
import { useVendorApproval } from '../hooks/useVendorApproval'
import { VendorApprovalTable } from '../components/VendorApprovalTable'
import { Skeleton } from '@/shared/components/ui/skeleton'

export function VendorApprovalQueue() {
  const { data: vendors, isLoading } = usePendingVendors()
  const { rejectingId, rejectReason, setRejectReason, approve, startReject, cancelReject, submitReject } = useVendorApproval()

  if (isLoading) return <Skeleton className="h-40 w-full" />
  if (!vendors?.length) return <p className="text-ink/50 py-8 text-center">No pending vendor approvals</p>

  return (
    <VendorApprovalTable
      vendors={vendors}
      rejectingId={rejectingId}
      rejectReason={rejectReason}
      onRejectReasonChange={setRejectReason}
      onApprove={(id) => approve.mutate(id)}
      onStartReject={startReject}
      onSubmitReject={submitReject}
      onCancelReject={cancelReject}
      isApproving={approve.isPending}
    />
  )
}
