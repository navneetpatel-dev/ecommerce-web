'use client'

import { usePendingVendors } from '../api/admin.queries'
import { useVendorApproval } from './useVendorApproval'

export function useVendorApprovalQueue() {
  const { data: vendors, isLoading } = usePendingVendors()
  const { approve, reject } = useVendorApproval()

  return {
    vendors,
    isLoading,
    onApprove: (id: string) => approve.mutateAsync(id),
    onReject: (id: string, reason: string) => reject.mutateAsync({ id, reason }),
    isApproving: approve.isPending,
    isRejecting: reject.isPending,
  }
}
