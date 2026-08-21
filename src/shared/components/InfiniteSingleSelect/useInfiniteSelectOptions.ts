"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  InfiniteSingleSelectOption,
  InfiniteSingleSelectPageQuery,
  InfiniteSingleSelectPageResult,
} from "./types";

function mergeUnique(
  existing: InfiniteSingleSelectOption[],
  incoming: InfiniteSingleSelectOption[],
): InfiniteSingleSelectOption[] {
  if (incoming.length === 0) return existing;
  const seen = new Set(existing.map((item) => item.id));
  const next = [...existing];
  for (const item of incoming) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    next.push(item);
  }
  return next;
}

type UseInfiniteSelectOptionsArgs = {
  open: boolean;
  disabled: boolean;
  fetchPage: (
    query: InfiniteSingleSelectPageQuery,
  ) => Promise<InfiniteSingleSelectPageResult>;
  resetKey: string | number | null;
  pinnedOption: InfiniteSingleSelectOption | null;
  pageSize: number;
  searchable: boolean;
};

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
  const [debouncedQuery, setDebouncedQuery] = useState("");
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
    setDebouncedQuery("");
  }, []);

  useEffect(() => {
    if (!searchable) {
      setDebouncedQuery("");
      return;
    }
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [query, searchable]);

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

        setOptions((prev) => {
          const merged = replace
            ? result.items
            : mergeUnique(prev, result.items);
          if (
            pinnedOption?.id &&
            !merged.some((item) => item.id === pinnedOption.id) &&
            (!debouncedQuery ||
              pinnedOption.label
                .toLowerCase()
                .includes(debouncedQuery.toLowerCase()))
          ) {
            return [pinnedOption, ...merged];
          }
          return merged;
        });
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
