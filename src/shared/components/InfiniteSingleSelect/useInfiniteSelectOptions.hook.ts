"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "@/shared/hooks/use-debounce.hook";
import type { InfiniteSingleSelectOption } from "./types";
import { mergePageOptions } from "./infiniteSelectOptions.utils";
import type { UseInfiniteSelectOptionsArgs } from "./types";

export function useInfiniteSelectOptions({
  open,
  disabled,
  fetchPage,
  resetKey,
  pinnedOption,
  pageSize,
  searchable,
}: UseInfiniteSelectOptionsArgs) {
  const [options, setOptions] = useState<InfiniteSingleSelectOption[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQueryState] = useState("");
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const fetchPageRef = useRef(fetchPage);
  fetchPageRef.current = fetchPage;

  const listRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);
  const loadingMoreRef = useRef(false);

  const resetQuery = useCallback(() => {
    setQueryState("");
  }, []);

  // Debounce the search text so typing does not fire a request per keystroke.
  const debouncedQuery = useDebouncedValue(searchable ? query.trim() : "", 250);

  useEffect(() => {
    resetQuery();
    setOptions([]);
    setPage(0);
    setTotalPages(1);
  }, [resetKey, resetQuery]);

  const loadPage = useCallback(
    async (pageToLoad: number, replace: boolean) => {
      const requestId = ++requestIdRef.current;
      if (replace) {
        setInitialLoading(true);
        setLoadError(false);
      } else {
        if (loadingMoreRef.current) return;
        loadingMoreRef.current = true;
        setLoadingMore(true);
      }

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
            replace,
            pinnedOption,
            query: debouncedQuery,
          }),
        );
        setPage(result.page);
        setTotalPages(Math.max(1, result.totalPages));
        setLoadError(false);
      } catch {
        if (requestId !== requestIdRef.current) return;
        if (replace) {
          setOptions([]);
          setPage(0);
          setTotalPages(1);
        }
        setLoadError(true);
      } finally {
        if (requestId === requestIdRef.current) {
          setInitialLoading(false);
          setLoadingMore(false);
          loadingMoreRef.current = false;
        }
      }
    },
    [debouncedQuery, pageSize, pinnedOption, searchable],
  );

  useEffect(() => {
    if (!open) return;
    void loadPage(1, true);
  }, [open, loadPage, resetKey]);

  const hasMore = page > 0 && page < totalPages;

  useEffect(() => {
    if (!open || disabled) return;
    const node = sentinelRef.current;
    const root = listRef.current;
    if (!node || !root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (initialLoading || loadingMoreRef.current || !hasMore) return;
        void loadPage(page + 1, false);
      },
      { root, rootMargin: "48px", threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [disabled, hasMore, initialLoading, loadPage, open, page, options.length]);

  return {
    options,
    query,
    setQuery: setQueryState,
    resetQuery,
    initialLoading,
    loadingMore,
    loadError,
    listRef,
    sentinelRef,
  };
}
