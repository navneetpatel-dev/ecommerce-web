"use client";

import { useProductModerationQueue } from "../hooks/useProductModerationQueue.hook";
import { ProductModerationTable } from "../components/ProductModerationTable.component";
import { LABELS } from "@/shared/constants/labels";

export function ProductModerationQueue() {
  const queue = useProductModerationQueue();

  if (!queue.isLoading && queue.pagination.total === 0) {
    return (
      <p className="py-8 text-center text-body text-ink-muted">
        {LABELS.noPendingProductApprovals}
      </p>
    );
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
  );
}
