"use client";

import { useVendorApprovalQueue } from "../hooks/useVendorApprovalQueue.hook";
import { VendorApprovalTable } from "../components/VendorApprovalTable.component";
import { LABELS } from "@/shared/constants/labels";

export function VendorApprovalQueue() {
  const queue = useVendorApprovalQueue();

  if (!queue.isLoading && queue.pagination.total === 0) {
    return (
      <p className="py-8 text-center text-body text-ink-muted">
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
