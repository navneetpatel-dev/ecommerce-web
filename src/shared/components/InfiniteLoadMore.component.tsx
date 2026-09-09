"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";

type Props = {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
};

/** Sentinel + optional button for paginated lists (IntersectionObserver auto-fetch). */
export function InfiniteLoadMore({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || !onLoadMore) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (isFetchingNextPage) return;
        onLoadMore();
      },
      { root: null, rootMargin: "200px", threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  if (!hasNextPage) return null;

  const loadMoreLabel = isFetchingNextPage
    ? LABELS.loadingMore
    : LABELS.loadMore;

  return (
    <div className="flex flex-col items-center gap-3 border-t border-line/70 pt-4">
      <div ref={sentinelRef} className="h-1 w-full" aria-hidden />
      <Button
        type="button"
        variant="outline"
        loading={isFetchingNextPage}
        onClick={onLoadMore}
      >
        {loadMoreLabel}
      </Button>
    </div>
  );
}
