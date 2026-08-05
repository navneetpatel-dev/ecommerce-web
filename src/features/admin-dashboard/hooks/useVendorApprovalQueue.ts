'use client'

import { usePendingVendors } from '../api/admin.queries'
import { useVendorApproval } from './useVendorApproval'

export function useVendorApprovalQueue() {
  const { data: vendors, isLoading } = usePendingVendors()
  const approval = useVendorApproval()

  return {
    vendors,
    isLoading,
    rejectingId: approval.rejectingId,
    rejectReason: approval.rejectReason,
    onRejectReasonChange: approval.setRejectReason,
    onApprove: (id: string) => approval.approve.mutate(id),
    onStartReject: approval.startReject,
    onSubmitReject: approval.submitReject,
    onCancelReject: approval.cancelReject,
    isApproving: approval.approve.isPending,
  }
}
