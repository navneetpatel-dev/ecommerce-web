"use client";

import { ClipboardCheck } from "lucide-react";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { useVendorApprovalQueue } from "../../hooks/vendors/useVendorApprovalQueue.hook";
import { VendorApprovalTable } from "../../components/vendors/VendorApprovalTable.component";
import { LABELS } from "@/shared/constants/labels";

export function VendorApprovalQueue() {
  const queue = useVendorApprovalQueue();

  if (!queue.isLoading && queue.pagination.total === 0) {
    return (
      <EmptyState
        icon={ClipboardCheck}
        heading={LABELS.noPendingVendorApprovals}
        message={LABELS.vendorApprovalsEmptyHint}
      />
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
