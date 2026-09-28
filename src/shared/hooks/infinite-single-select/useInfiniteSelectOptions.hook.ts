"use client";

import { useRef } from "react";
import { useInfiniteScrollSentinel } from "../infinite-select/useInfiniteScrollSentinel.hook";
import { useInfiniteSelectQueryState } from "../infinite-select/useInfiniteSelectQueryState.hook";
import { useInfiniteSelectPages } from "../infinite-select/useInfiniteSelectPages.hook";
import type { UseInfiniteSelectOptionsArgs } from "../../types/infinite-single-select/types";

export function useInfiniteSelectOptions({
  open,
  disabled,
  fetchPage,
  pinnedOption,
  pageSize,
  searchable,
}: UseInfiniteSelectOptionsArgs) {
  const {
    query,
    setQuery,
    resetQuery,
    debouncedQuery,
    initialLoading,
    setInitialLoading,
  } = useInfiniteSelectQueryState({ open, searchable });

  const {
    options,
    page,
    loadingMore,
    loadError,
    hasMore,
    loadMore,
    loadingMoreRef,
  } = useInfiniteSelectPages({
    open,
    searchable,
    debouncedQuery,
    pageSize,
    pinnedOption: pinnedOption ?? null,
    fetchPage,
    setInitialLoading,
  });

  const listRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useInfiniteScrollSentinel({
    enabled: open && !disabled,
    hasMore,
    initialLoading,
    rootRef: listRef,
    sentinelRef,
    page,
    loadingMoreRef,
    loadMore,
    listLength: options.length,
  });

  return {
    options,
    query,
    setQuery,
    resetQuery,
    initialLoading,
    loadingMore,
    loadError,
    listRef,
    sentinelRef,
  };
}
