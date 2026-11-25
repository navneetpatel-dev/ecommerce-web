"use client";

import { ClipboardCheck } from "lucide-react";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { SearchInput } from "@/shared/components/ui/SearchInput.component";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { useVendorApprovalQueue } from "../../hooks/vendors/useVendorApprovalQueue.hook";
import { VendorApprovalTable } from "../../components/vendors/VendorApprovalTable.component";
import { LABELS } from "@/shared/constants/labels";

export function VendorApprovalQueue() {
  const queue = useVendorApprovalQueue();

  if (
    !queue.isLoading &&
    queue.pagination.total === 0 &&
    !queue.search.trim() &&
    !queue.kycFilter
  ) {
    return (
      <EmptyState
        icon={ClipboardCheck}
        heading={LABELS.noPendingVendorApprovals}
        message={LABELS.vendorApprovalsEmptyHint}
      />
    );
  }

  const activeCount = [queue.search.trim(), queue.kycFilter].filter(
    Boolean,
  ).length;

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

          <FormFieldFrame
            label={LABELS.status}
            htmlFor="vendor-approval-filter-status"
          >
            <Select disabled value="PENDING">
              <SelectTrigger
                id="vendor-approval-filter-status"
                className="cursor-not-allowed opacity-80"
              >
                <SelectValue>Pending</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldFrame>

          <FormFieldFrame
            label="KYC Status"
            htmlFor="vendor-approval-filter-kyc"
          >
            <Select
              value={queue.kycFilter || "__ALL__"}
              onValueChange={(v) =>
                queue.onKycFilterChange(v === "__ALL__" ? "" : v)
              }
            >
              <SelectTrigger id="vendor-approval-filter-kyc">
                <SelectValue placeholder="All KYC Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__ALL__">All KYC Statuses</SelectItem>
                <SelectItem value="COMPLETE">KYC Complete</SelectItem>
                <SelectItem value="INCOMPLETE">KYC Incomplete</SelectItem>
              </SelectContent>
            </Select>
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
