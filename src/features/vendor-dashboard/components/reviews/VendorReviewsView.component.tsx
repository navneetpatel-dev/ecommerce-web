"use client";

import { useState, useMemo } from "react";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { LABELS } from "@/shared/constants/labels";
import type { Review } from "@/shared/api/types";
import { FormFieldFrame } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { SearchInput } from "@/shared/components/ui/SearchInput.component";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { VendorReviewRespondDialog } from "./VendorReviewRespondDialog.component";
import { VendorReviewFlagDialog } from "./VendorReviewFlagDialog.component";
import { VendorReviewsList } from "./VendorReviewsView/VendorReviewsList.component";
import { VendorReviewsSkeletonList } from "./VendorReviewsView/VendorReviewsSkeletonList.component";
import { useVendorReviewsViewState } from "../../hooks/reviews/useVendorReviewsViewState.hook";
import { vendorFeedbackViewsStyles as styles } from "../../styles/reviews/vendorFeedbackViews.styles";

interface VendorReviewsViewProps {
  reviews: Review[];
  isLoading?: boolean;
  loadError?: string | null;
  submitting?: boolean;
  onRespond: (reviewId: string, response: string) => void | Promise<void>;
  onFlag?: (reviewId: string, reason: string) => void | Promise<void>;
}

export function VendorReviewsView({
  reviews,
  isLoading = false,
  loadError = null,
  submitting = false,
  onRespond,
  onFlag,
}: VendorReviewsViewProps) {
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("");
  const [responseStatus, setResponseStatus] = useState("");
  const [page, setPage] = useState(1);
  const REVIEWS_PAGE_SIZE = 20;

  const {
    targetId,
    flagTargetId,
    activeReview,
    handleOpenRespond,
    handleOpenFlag,
    handleRespondOpenChange,
    handleFlagOpenChange,
    handleRespondSubmit,
    handleFlagSubmit,
    handleRemoveReply,
  } = useVendorReviewsViewState({ reviews, onRespond, onFlag });

  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        const title = String(r.title ?? "").toLowerCase();
        const body = String(r.body ?? "").toLowerCase();
        const userName = String(r.user?.name ?? "").toLowerCase();
        const prodName = String(r.product?.name ?? "").toLowerCase();
        if (
          !title.includes(query) &&
          !body.includes(query) &&
          !userName.includes(query) &&
          !prodName.includes(query)
        ) {
          return false;
        }
      }
      if (rating && String(r.rating) !== rating) {
        return false;
      }
      if (responseStatus === "ANSWERED" && !r.vendorResponse) {
        return false;
      }
      if (responseStatus === "UNANSWERED" && Boolean(r.vendorResponse)) {
        return false;
      }
      return true;
    });
  }, [reviews, debouncedSearch, rating, responseStatus]);

  const activeCount =
    (search.trim() ? 1 : 0) + (rating ? 1 : 0) + (responseStatus ? 1 : 0);

  const handleClear = () => {
    setSearch("");
    setRating("");
    setResponseStatus("");
  };

  const loadingContent = isLoading ? <VendorReviewsSkeletonList /> : null;

  const errorContent = loadError ? (
    <p role="alert" className={styles.errorBox}>
      {loadError}
    </p>
  ) : null;

  const emptyContent =
    !isLoading && !loadError && !filteredReviews.length ? (
      <p className={styles.emptyText}>{LABELS.noReviewsFound}</p>
    ) : null;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReviews.length / REVIEWS_PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);
  const pagedReviews = useMemo(() => {
    const start = (currentPage - 1) * REVIEWS_PAGE_SIZE;
    return filteredReviews.slice(start, start + REVIEWS_PAGE_SIZE);
  }, [filteredReviews, currentPage]);

  const listContent =
    !isLoading && !loadError && filteredReviews.length > 0 ? (
      <>
        <VendorReviewsList
          reviews={pagedReviews}
          onOpenRespond={handleOpenRespond}
          onOpenFlag={handleOpenFlag}
          onRemoveReply={handleRemoveReply}
          canFlag={Boolean(onFlag)}
        />
        {totalPages > 1 ? (
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <span className="text-body-sm text-ink-muted">
              Page {currentPage} of {totalPages} ({filteredReviews.length}{" "}
              reviews)
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
        ) : null}
      </>
    ) : null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{LABELS.reviews}</h1>
          <p className={styles.hint}>{LABELS.vendorReviewsHint}</p>
        </div>
      </div>

      <div className="mb-4">
        <CollapsibleTableFilters
          activeCount={activeCount}
          onClear={handleClear}
          resultCount={{
            count: filteredReviews.length,
            total: reviews.length,
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

      {loadingContent}
      {errorContent}
      {emptyContent}
      {listContent}

      <VendorReviewRespondDialog
        open={Boolean(targetId)}
        initialResponse={activeReview?.vendorResponse ?? ""}
        submitting={submitting}
        onOpenChange={handleRespondOpenChange}
        onSubmit={handleRespondSubmit}
      />

      <VendorReviewFlagDialog
        open={Boolean(flagTargetId)}
        submitting={submitting}
        onOpenChange={handleFlagOpenChange}
        onSubmit={handleFlagSubmit}
      />
    </section>
  );
}
