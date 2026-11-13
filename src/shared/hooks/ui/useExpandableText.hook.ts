"use client";

import { useState } from "react";

/**
 * Long text starts clamped with a "Read more" toggle. Decided by length, not
 * by measuring, so it renders the same on the server and needs no resize work.
 */
export function useExpandableText(text: string, threshold: number) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > threshold;

  return {
    isLong,
    expanded,
    clamped: isLong && !expanded,
    toggle: () => setExpanded((open) => !open),
  };
}
