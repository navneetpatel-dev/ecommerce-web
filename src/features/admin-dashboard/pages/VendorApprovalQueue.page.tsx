"use client";

import { useVendorApprovalQueue } from "../hooks/useVendorApprovalQueue.hook";
import { VendorApprovalTable } from "../components/VendorApprovalTable.component";
import { LABELS } from "@/shared/constants/labels";
import { adminPagesStyles } from "./adminPages.styles";

export function VendorApprovalQueue() {
  const queue = useVendorApprovalQueue();

  if (!queue.isLoading && queue.pagination.total === 0) {
    return (
      <p className={adminPagesStyles.emptyCenteredNotice}>
        {LABELS.noPendingVendorApprovals}
      </p>
    );
  }

  return (
    <VendorApprovalTable
      vendors={queue.vendors}
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
