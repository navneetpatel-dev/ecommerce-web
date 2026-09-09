"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  InfiniteMultiSelectOption,
  InfiniteMultiSelectPageQuery,
  InfiniteMultiSelectPageResult,
} from "../../types/infinite-multi-select/types";

function mergeUnique(
  existing: InfiniteMultiSelectOption[],
  incoming: InfiniteMultiSelectOption[],
): InfiniteMultiSelectOption[] {
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
  disabled: boolean;
  fetchPage: (
    query: InfiniteMultiSelectPageQuery,
  ) => Promise<InfiniteMultiSelectPageResult>;
  resetKey: string | number | null;
  pageSize: number;
};

export function useInfiniteSelectOptions({
  disabled,
  fetchPage,
  resetKey,
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

  const fetchPageRef = useRef(fetchPage);
  fetchPageRef.current = fetchPage;

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);
  const loadingMoreRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setQueryState("");
    setDebouncedQuery("");
  }, [resetKey]);

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
          search: debouncedQuery || undefined,
        });
        if (requestId !== requestIdRef.current) return;

        setOptions((prev) =>
          replace ? result.items : mergeUnique(prev, result.items),
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
    [debouncedQuery, pageSize],
  );

  useEffect(() => {
    void loadPage(1, true);
  }, [loadPage, resetKey]);

  const hasMore = page > 0 && page < totalPages;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || disabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (initialLoading || loadingMoreRef.current || !hasMore) return;
        void loadPage(page + 1, false);
      },
      { root: node.parentElement, rootMargin: "48px", threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [disabled, hasMore, initialLoading, loadPage, page, options.length]);

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
