"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInfiniteScrollSentinel } from "../infinite-select/useInfiniteScrollSentinel.hook";
import { mergeUniqueById } from "../../utils/infinite-select/mergeUniqueById";
import type {
  InfiniteMultiSelectOption,
  InfiniteMultiSelectPageQuery,
  InfiniteMultiSelectPageResult,
} from "../../types/infinite-multi-select/types";

type UseInfiniteSelectOptionsArgs = {
  disabled: boolean;
  fetchPage: (
    query: InfiniteMultiSelectPageQuery,
  ) => Promise<InfiniteMultiSelectPageResult>;
  pageSize: number;
};

export function useInfiniteSelectOptions({
  disabled,
  fetchPage,
  pageSize,
}: UseInfiniteSelectOptionsArgs) {
  const [options, setOptions] = useState<InfiniteMultiSelectOption[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQueryState] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [querySnapshot, setQuerySnapshot] = useState(debouncedQuery);

  if (debouncedQuery !== querySnapshot) {
    setQuerySnapshot(debouncedQuery);
    setInitialLoading(true);
  }

  const fetchPageRef = useRef(fetchPage);
  useEffect(() => {
    fetchPageRef.current = fetchPage;
  }, [fetchPage]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);
  const loadingMoreRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

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
          search: debouncedQuery || undefined,
        });
        if (requestId !== requestIdRef.current) return;

        setOptions((prev) => mergeUniqueById(prev, result.items));
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
    [debouncedQuery, pageSize],
  );

  useEffect(() => {
    let cancelled = false;
    const requestId = ++requestIdRef.current;

    void (async () => {
      try {
        const result = await fetchPageRef.current({
          page: 1,
          limit: pageSize,
          search: debouncedQuery || undefined,
        });
        if (cancelled || requestId !== requestIdRef.current) return;
        setOptions(result.items);
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
  }, [debouncedQuery, pageSize]);

  const hasMore = page > 0 && page < totalPages;

  useInfiniteScrollSentinel({
    enabled: !disabled,
    hasMore,
    initialLoading,
    sentinelRef,
    page,
    loadingMoreRef,
    loadMore,
    listLength: options.length,
  });

  return {
    options,
    query,
    setQuery: setQueryState,
    initialLoading,
    loadingMore,
    loadError,
    sentinelRef,
  };
}
