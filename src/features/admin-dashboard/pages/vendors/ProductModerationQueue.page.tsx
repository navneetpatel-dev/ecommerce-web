"use client";

import { ApproveOwnWorkDialog } from "../../components/vendors/ApproveOwnWorkDialog.component";
import { PackageSearch } from "lucide-react";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { useProductModerationQueue } from "../../hooks/vendors/useProductModerationQueue.hook";
import { ProductModerationTable } from "../../components/vendors/ProductModerationTable.component";
import { AdminProductsFilters } from "../../components/vendors/AdminProductsFilters.component";
import { LABELS } from "@/shared/constants/labels";

export function ProductModerationQueue() {
  const queue = useProductModerationQueue();

  if (!queue.isLoading && queue.pagination.total === 0 && !queue.hasFilters) {
    return (
      <EmptyState
        icon={PackageSearch}
        heading={LABELS.noPendingProductApprovals}
        message={LABELS.productApprovalsEmptyHint}
      />
    );
  }

  return (
    <div className="space-y-4">
      <AdminProductsFilters {...queue.filters} />

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
      <ApproveOwnWorkDialog
        open={queue.ownWorkOpen}
        onConfirm={queue.onApproveOwnWork}
        onClose={queue.closeOwnWork}
      />
    </div>
  );
}
