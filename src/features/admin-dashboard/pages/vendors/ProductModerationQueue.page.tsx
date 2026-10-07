"use client";

import { PackageSearch } from "lucide-react";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { useProductModerationQueue } from "../../hooks/vendors/useProductModerationQueue.hook";
import { ProductModerationTable } from "../../components/vendors/ProductModerationTable.component";
import { LABELS } from "@/shared/constants/labels";

export function ProductModerationQueue() {
  const queue = useProductModerationQueue();

  if (!queue.isLoading && queue.pagination.total === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        heading={LABELS.noPendingProductApprovals}
        message={LABELS.productApprovalsEmptyHint}
      />
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
