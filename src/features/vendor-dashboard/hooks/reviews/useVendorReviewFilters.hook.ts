"use client";

import { useMemo, useState } from "react";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import type { Review } from "@/shared/api/types";

const REVIEWS_PAGE_SIZE = 20;

/** Searching, filtering and paging the vendor's reviews. */
export function useVendorReviewFilters(reviews: Review[]) {
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("");
  const [responseStatus, setResponseStatus] = useState("");
  const [page, setPage] = useState(1);

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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReviews.length / REVIEWS_PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);
  const pagedReviews = useMemo(() => {
    const start = (currentPage - 1) * REVIEWS_PAGE_SIZE;
    return filteredReviews.slice(start, start + REVIEWS_PAGE_SIZE);
  }, [filteredReviews, currentPage]);

  return {
    search,
    setSearch,
    rating,
    setRating,
    responseStatus,
    setResponseStatus,
    setPage,
    activeCount,
    handleClear,
    filteredReviews,
    pagedReviews,
    totalPages,
    currentPage,
  };
}

export type VendorReviewFilterState = ReturnType<typeof useVendorReviewFilters>;
