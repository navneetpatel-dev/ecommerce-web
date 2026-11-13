"use client";

import { useState } from "react";

/**
 * Long text starts clamped with a "Read more" toggle. Decided by length, not
 * by measuring, so it renders the same on the server and needs no resize work.
 */
export function useExpandableText(text: string, threshold: number) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > threshold;

  const clamped = isLong && !expanded;
  return {
    isLong,
    expanded,
    clamped,
    // Clamped, paragraphs flow as one (blank lines would eat the visible lines
    // and leave the ellipsis alone on its own line); expanded keeps them.
    displayText: clamped ? text.replace(/\s*\n+\s*/g, " ") : text,
    toggle: () => setExpanded((open) => !open),
  };
}
