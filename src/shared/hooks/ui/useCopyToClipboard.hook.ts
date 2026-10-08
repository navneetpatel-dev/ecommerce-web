"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Copy text to the clipboard with a transient `copied` flag for UI feedback.
 * Clipboard failures are swallowed — the flag simply never flips.
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
      void navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(true);
          if (timeoutRef.current != null) {
            window.clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = window.setTimeout(
            () => setCopied(false),
            resetMs,
          );
        })
        .catch(() => {
          /* Clipboard unavailable (permission/insecure context) — no-op. */
        });
    },
    [resetMs],
  );

  return { copied, copy };
}
