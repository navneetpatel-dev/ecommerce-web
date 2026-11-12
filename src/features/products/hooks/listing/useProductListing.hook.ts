"use client";

import { useRef, useState } from "react";
import { motionSafeScrollBehavior } from "@/shared/utils/a11y/scrollMotion";
import { useFilters } from "../filters/useFilters.hook";
import { useCompare } from "../compare/useCompare.hook";
import { useProductList } from "../../api/listing/products.queries";

// Kept in sync with SortOptionsList.component.tsx's SORT_OPTIONS — see its comment for why
// "Popular" isn't offered (byte-identical backend query to "Trending").
export const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price Low to High" },
  { value: "price_desc", label: "Price High to Low" },
  { value: "rating", label: "Top Rated" },
] as const;

export function useProductListing() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const compareSectionRef = useRef<HTMLElement>(null);
  // Compare selection is app-wide (survives navigation + /compare), so it lives
  // in the compare store rather than PLP-local state.
  const compare = useCompare();
  const {
    filters,
    updateFilter,
    updateFilterDebounced,
    removeFilters,
    removeAttrValue,
    clearFilters,
  } = useFilters();
  const { data, isFetching, isError, refetch } = useProductList(filters);
  const page = filters.page ?? 1;
  const totalPages = data?.totalPages ?? 0;
  // A page number past the end (e.g. ?page=99999) gets its own message and a way back.
  const isPastEnd =
    Boolean(data) &&
    data!.items.length === 0 &&
    totalPages > 0 &&
    page > totalPages;
  const retry = () => {
    void refetch();
  };
  // The search endpoint (GET /api/search) ranks by text relevance and doesn't accept sort/rating/
  // attribute params at all — see fetchProductList's dropped-params comment. Surfacing those
  // controls as interactive while they're silently ignored reads as broken filtering.
  const isSearchActive = Boolean(filters.search?.trim());

  const toggleCompareProduct = compare.toggleCompareProduct;

  const scrollToCompare = () => {
    compareSectionRef.current?.scrollIntoView({
      behavior: motionSafeScrollBehavior(),
      block: "start",
    });
  };

  const selectSort = (value: string) => {
    updateFilter("sort", value);
    setSortOpen(false);
  };

  return {
    filterOpen,
    sortOpen,
    compareMode: compare.compareMode,
    comparedProducts: compare.comparedProducts,
    comparedIds: compare.comparedIds,
    compareAtLimit: compare.compareAtLimit,
    compareSectionRef,
    filters,
    data,
    isFetching,
    // Shown when the products request fails, instead of skeletons forever.
    isError: isError && !data,
    retry,
    isPastEnd,
    goToFirstPage: () => updateFilter("page", 1),
    goToLastPage: () => updateFilter("page", totalPages),
    isSearchActive,
    openFilters: () => setFilterOpen(true),
    closeFilters: () => setFilterOpen(false),
    openSort: () => setSortOpen(true),
    closeSort: () => setSortOpen(false),
    toggleCompareMode: compare.toggleCompareMode,
    toggleCompareProduct,
    clearComparedProducts: compare.clearComparedProducts,
    scrollToCompare,
    updateFilter,
    updateFilterDebounced,
    removeFilters,
    removeAttrValue,
    clearFilters,
    selectSort,
  };
}
