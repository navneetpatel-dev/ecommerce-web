"use client";

import { PackageSearch } from "lucide-react";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { useProductModerationQueue } from "../../hooks/vendors/useProductModerationQueue.hook";
import { ProductModerationTable } from "../../components/vendors/ProductModerationTable.component";
import { LABELS } from "@/shared/constants/labels";

export function ProductModerationQueue() {
  const queue = useProductModerationQueue();

  if (
    !queue.isLoading &&
    queue.pagination.total === 0 &&
    !queue.search.trim()
  ) {
    return (
      <EmptyState
        icon={PackageSearch}
        heading={LABELS.noPendingProductApprovals}
        message={LABELS.productApprovalsEmptyHint}
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
            htmlFor="product-moderation-filter-search"
          >
            <Input
              id="product-moderation-filter-search"
              value={queue.search}
              onChange={(e) => queue.onSearchChange(e.target.value)}
              placeholder="Search by product name or SKU..."
            />
          </FormFieldFrame>

          {activeCount > 0 && (
            <div className="flex items-end">
              <Button type="button" variant="outline" onClick={queue.onClear}>
                {LABELS.clearFilters}
              </Button>
            </div>
          )}
        </div>
      </CollapsibleTableFilters>

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
    </div>
  );
}
