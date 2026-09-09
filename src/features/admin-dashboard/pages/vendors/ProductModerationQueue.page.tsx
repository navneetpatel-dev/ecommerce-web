"use client";

import { useProductModerationQueue } from "../../hooks/vendors/useProductModerationQueue.hook";
import { ProductModerationTable } from "../../components/vendors/ProductModerationTable.component";
import { LABELS } from "@/shared/constants/labels";
import { adminPagesStyles } from "../shared/adminPages.styles";

export function ProductModerationQueue() {
  const queue = useProductModerationQueue();

  if (!queue.isLoading && queue.pagination.total === 0) {
    return (
      <p className={adminPagesStyles.emptyCenteredNotice}>
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
