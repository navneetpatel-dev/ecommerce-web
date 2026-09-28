"use client";

import { useEffect, type RefObject } from "react";

interface UseInfiniteScrollSentinelParams {
  /** False while the popover is closed, disabled, or has no root node. */
  enabled: boolean;
  hasMore: boolean;
  initialLoading: boolean;
  /** Scroll container the observer's root is derived from. */
  rootRef?: RefObject<HTMLElement | null>;
  sentinelRef: RefObject<HTMLElement | null>;
  page: number;
  /** Guard so a second intersection cannot start a duplicate page load. */
  loadingMoreRef: RefObject<boolean>;
  loadMore: (page: number) => void;
  /** Extra trigger so the observer re-arms when the list grows. */
  listLength: number;
}

/**
 * Loads the next page when the sentinel scrolls into view. Extracted from both
 * infinite-select variants — identical observer setup, differing only in which
 * root element and enablement flags they pass.
 */
export function useInfiniteScrollSentinel({
  enabled,
  hasMore,
  initialLoading,
  rootRef,
  sentinelRef,
  page,
  loadingMoreRef,
  loadMore,
  listLength,
}: UseInfiniteScrollSentinelParams) {
  useEffect(() => {
    if (!enabled) return;
    const node = sentinelRef.current;
    if (!node) return;
    const root = rootRef ? rootRef.current : node.parentElement;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (initialLoading || loadingMoreRef.current || !hasMore) return;
        loadMore(page + 1);
      },
      { root, rootMargin: "48px", threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [
    enabled,
    hasMore,
    initialLoading,
    rootRef,
    sentinelRef,
    page,
    loadingMoreRef,
    loadMore,
    listLength,
  ]);
}
