"use client";

import { useCallback, useMemo, useState } from "react";

/**
 * A list that shows its first few items and grows in place on "Show N more", with no
 * inner scroll box. Used by the cart and product-page offer lists.
 */
export function useExpandableList<T>(items: T[], previewCount: number) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = items.length > previewCount;
  const visibleItems = useMemo(
    () => (expanded || !canExpand ? items : items.slice(0, previewCount)),
    [canExpand, expanded, items, previewCount],
  );
  const toggleExpanded = useCallback(
    () => setExpanded((current) => !current),
    [],
  );
  return {
    expanded,
    canExpand,
    visibleItems,
    hiddenCount: Math.max(0, items.length - previewCount),
    toggleExpanded,
  };
}
