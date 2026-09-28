"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { InfiniteSingleSelectOption } from "../../types/infinite-single-select/types";
import type { UseInfiniteSelectOptionsArgs } from "../../types/infinite-single-select/types";
import { mergePageOptions } from "../../utils/infinite-single-select/infiniteSelectOptions.utils";

interface UseInfiniteSelectPagesParams {
  open: boolean;
  searchable: boolean;
  debouncedQuery: string;
  pageSize: number;
  pinnedOption: InfiniteSingleSelectOption | null;
  fetchPage: UseInfiniteSelectOptionsArgs["fetchPage"];
  /** Owned by the query-state hook; cleared here once page 1 resolves. */
  setInitialLoading: (loading: boolean) => void;
}

/**
 * Owns the loaded pages for the single-select listbox: the first page (reloaded
 * whenever the popover opens or the search term changes) and the "next page"
 * loader driven by the scroll sentinel. Home of the request-id guard that keeps
 * a slow response from overwriting a newer one.
 */
export function useInfiniteSelectPages({
  open,
  searchable,
  debouncedQuery,
  pageSize,
  pinnedOption,
  fetchPage,
  setInitialLoading,
}: UseInfiniteSelectPagesParams) {
  const [options, setOptions] = useState<InfiniteSingleSelectOption[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const fetchPageRef = useRef(fetchPage);
  useEffect(() => {
    fetchPageRef.current = fetchPage;
  }, [fetchPage]);

  const requestIdRef = useRef(0);
  const loadingMoreRef = useRef(false);

  const loadMore = useCallback(
    async (pageToLoad: number) => {
      if (loadingMoreRef.current) return;
      loadingMoreRef.current = true;
      setLoadingMore(true);
      const requestId = ++requestIdRef.current;

      try {
        const result = await fetchPageRef.current({
          page: pageToLoad,
          limit: pageSize,
          search: searchable && debouncedQuery ? debouncedQuery : undefined,
        });
        if (requestId !== requestIdRef.current) return;

        setOptions((prev) =>
          mergePageOptions({
            previous: prev,
            incoming: result.items,
            replace: false,
            pinnedOption,
            query: debouncedQuery,
          }),
        );
        setPage(result.page);
        setTotalPages(Math.max(1, result.totalPages));
        setLoadError(false);
      } catch {
        if (requestId !== requestIdRef.current) return;
        setLoadError(true);
      } finally {
        if (requestId === requestIdRef.current) {
          setLoadingMore(false);
          loadingMoreRef.current = false;
        }
      }
    },
    [debouncedQuery, pageSize, pinnedOption, searchable],
  );

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const requestId = ++requestIdRef.current;

    void (async () => {
      try {
        const result = await fetchPageRef.current({
          page: 1,
          limit: pageSize,
          search: searchable && debouncedQuery ? debouncedQuery : undefined,
        });
        if (cancelled || requestId !== requestIdRef.current) return;
        setOptions(
          mergePageOptions({
            previous: [],
            incoming: result.items,
            replace: true,
            pinnedOption,
            query: debouncedQuery,
          }),
        );
        setPage(result.page);
        setTotalPages(Math.max(1, result.totalPages));
        setLoadError(false);
      } catch {
        if (cancelled || requestId !== requestIdRef.current) return;
        setOptions([]);
        setPage(0);
        setTotalPages(1);
        setLoadError(true);
      } finally {
        if (!cancelled && requestId === requestIdRef.current) {
          setInitialLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    open,
    debouncedQuery,
    pageSize,
    pinnedOption,
    searchable,
    setInitialLoading,
  ]);

  return {
    options,
    page,
    totalPages,
    loadingMore,
    loadError,
    hasMore: page > 0 && page < totalPages,
    loadMore,
    loadingMoreRef,
  };
}
