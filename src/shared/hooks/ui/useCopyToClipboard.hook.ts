"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { writeToClipboard } from "@/shared/utils/dom/clipboard";

/**
 * Copy text to the clipboard with a transient `copied` flag for UI feedback.
 * Falls back to a selection copy; if that fails too the flag simply never flips.
 */
export function useCopyToClipboard(resetMs = 2000) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  const copy = useCallback(
    (text: string) => {
      void writeToClipboard(text).then((ok) => {
        if (!ok) return;
        setCopied(true);
        if (timeoutRef.current != null) {
          window.clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => setCopied(false), resetMs);
      });
    },
    [resetMs],
  );

  return { copied, copy };
}
