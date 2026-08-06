'use client'

import { useProductModerationQueue } from '../hooks/useProductModerationQueue'
import { ProductModerationTable } from '../components/ProductModerationTable'
import { LABELS } from '@/shared/constants/labels'

export function ProductModerationQueue() {
  const queue = useProductModerationQueue()

  if (!queue.isLoading && queue.pagination.total === 0) {
    return (
      <p className="py-8 text-center text-[0.9375rem] text-ink-muted">
        {LABELS.noPendingProductApprovals}
      </p>
    )
  }

  return (
    <ProductModerationTable
      products={queue.products}
      loading={queue.isLoading}
      pagination={queue.pagination}
      onRefresh={queue.reload}
      onApprove={queue.onApprove}
      onReject={queue.onReject}
      isApproving={queue.isApproving}
      isRejecting={queue.isRejecting}
    />
  )
}
