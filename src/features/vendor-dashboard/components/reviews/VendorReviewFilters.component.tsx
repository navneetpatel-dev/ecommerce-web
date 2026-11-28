"use client";

import { LABELS } from "@/shared/constants/labels";
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
import type { VendorReviewFilterState } from "../../hooks/reviews/useVendorReviewFilters.hook";

interface VendorReviewFiltersProps {
  filters: VendorReviewFilterState;
  total: number;
}

/** Search, star rating and reply status. */
export function VendorReviewFilters({
  filters,
  total,
}: VendorReviewFiltersProps) {
  const {
    search,
    setSearch,
    rating,
    setRating,
    responseStatus,
    setResponseStatus,
    activeCount,
    handleClear,
    filteredReviews,
  } = filters;

  return (
    <div className="mb-4">
      <CollapsibleTableFilters
        activeCount={activeCount}
        onClear={handleClear}
        resultCount={{
          count: filteredReviews.length,
          total,
        }}
      >
        <div className="flex flex-wrap items-end gap-3">
          <FormFieldFrame
            label={LABELS.search ?? "Search"}
            htmlFor="vendor-reviews-search"
            className="w-72"
          >
            <SearchInput
              id="vendor-reviews-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
              placeholder="Search reviewer, product, or review text..."
            />
          </FormFieldFrame>

          <FormFieldFrame
            label="Rating"
            htmlFor="vendor-reviews-rating"
            className="w-40"
          >
            <Select
              value={rating}
              onValueChange={(val) => setRating(val === "ALL" ? "" : val)}
            >
              <SelectTrigger id="vendor-reviews-rating">
                <SelectValue placeholder="All ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldFrame>

          <FormFieldFrame
            label="Response"
            htmlFor="vendor-reviews-status"
            className="w-40"
          >
            <Select
              value={responseStatus}
              onValueChange={(val) =>
                setResponseStatus(val === "ALL" ? "" : val)
              }
            >
              <SelectTrigger id="vendor-reviews-status">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="UNANSWERED">Pending Reply</SelectItem>
                <SelectItem value="ANSWERED">Replied</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldFrame>
        </div>
      </CollapsibleTableFilters>
    </div>
  );
}
