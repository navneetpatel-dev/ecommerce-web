'use client'

import { usePendingProducts } from '../api/admin.queries'
import { useProductModeration } from './useProductModeration'

export function useProductModerationQueue() {
  const { data: products, isLoading } = usePendingProducts()
  const { approve, reject } = useProductModeration()

  return {
    products,
    isLoading,
    onApprove: (id: string) => approve.mutateAsync(id),
    onReject: (id: string, note: string) => reject.mutateAsync({ id, note }),
    isApproving: approve.isPending,
    isRejecting: reject.isPending,
  }
}
