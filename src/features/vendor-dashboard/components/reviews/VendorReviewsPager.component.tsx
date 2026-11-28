"use client";

import { Button } from "@/shared/components/ui/button";
import type { VendorReviewFilterState } from "../../hooks/reviews/useVendorReviewFilters.hook";

/** Previous and next page of the filtered reviews. */
export function VendorReviewsPager({
  filters,
}: {
  filters: VendorReviewFilterState;
}) {
  const { totalPages, currentPage, filteredReviews, setPage } = filters;
  if (totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
      <span className="text-body-sm text-ink-muted">
        Page {currentPage} of {totalPages} ({filteredReviews.length} reviews)
      </span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
