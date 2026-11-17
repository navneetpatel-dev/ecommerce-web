"use client";

import { ClipboardCheck } from "lucide-react";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { SearchInput } from "@/shared/components/ui/SearchInput.component";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { useVendorApprovalQueue } from "../../hooks/vendors/useVendorApprovalQueue.hook";
import { VendorApprovalTable } from "../../components/vendors/VendorApprovalTable.component";
import { LABELS } from "@/shared/constants/labels";

export function VendorApprovalQueue() {
  const queue = useVendorApprovalQueue();

  if (
    !queue.isLoading &&
    queue.pagination.total === 0 &&
    !queue.search.trim()
  ) {
    return (
      <EmptyState
        icon={ClipboardCheck}
        heading={LABELS.noPendingVendorApprovals}
        message={LABELS.vendorApprovalsEmptyHint}
      />
    );
  }

  const activeCount = queue.search.trim() ? 1 : 0;

  return (
    <div className="space-y-4">
      <CollapsibleTableFilters
        activeCount={activeCount}
        onClear={queue.onClear}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
          <FormFieldFrame
            label={LABELS.search}
            htmlFor="vendor-approval-filter-search"
          >
            <SearchInput
              id="vendor-approval-filter-search"
              value={queue.search}
              onChange={(e) => queue.onSearchChange(e.target.value)}
              onClear={() => queue.onSearchChange("")}
              placeholder="Search by vendor name, store, email..."
            />
          </FormFieldFrame>
        </div>
      </CollapsibleTableFilters>

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
    </div>
  );
}
