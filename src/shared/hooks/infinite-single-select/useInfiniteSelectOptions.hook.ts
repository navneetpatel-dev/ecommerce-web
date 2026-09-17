"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import type { InfiniteSingleSelectOption } from "../../types/infinite-single-select/types";
import { mergePageOptions } from "../../utils/infinite-single-select/infiniteSelectOptions.utils";
import type { UseInfiniteSelectOptionsArgs } from "../../types/infinite-single-select/types";

export function useInfiniteSelectOptions({
  open,
  disabled,
  fetchPage,
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
  const resetQuery = useCallback(() => {
    setQueryState("");
  }, []);
  const debouncedQuery = useDebouncedValue(searchable ? query.trim() : "", 250);
  const [openSnapshot, setOpenSnapshot] = useState(open);
  const [querySnapshot, setQuerySnapshot] = useState(debouncedQuery);

  if (open !== openSnapshot) {
    setOpenSnapshot(open);
    if (open) setInitialLoading(true);
  }
  if (open && debouncedQuery !== querySnapshot) {
    setQuerySnapshot(debouncedQuery);
    setInitialLoading(true);
  }
  if (!open && debouncedQuery !== querySnapshot) {
    setQuerySnapshot(debouncedQuery);
  }

  const fetchPageRef = useRef(fetchPage);
  useEffect(() => {
    fetchPageRef.current = fetchPage;
  }, [fetchPage]);

  const listRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
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
  }, [open, debouncedQuery, pageSize, pinnedOption, searchable]);

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
        void loadMore(page + 1);
      },
      { root, rootMargin: "48px", threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [disabled, hasMore, initialLoading, loadMore, open, page, options.length]);

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
