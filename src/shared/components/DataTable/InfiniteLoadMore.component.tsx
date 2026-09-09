"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { infiniteLoadMoreStyles } from "./dataTableComponents.styles";

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
    <div className={infiniteLoadMoreStyles.container}>
      <div
        ref={sentinelRef}
        className={infiniteLoadMoreStyles.sentinel}
        aria-hidden
      />
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
