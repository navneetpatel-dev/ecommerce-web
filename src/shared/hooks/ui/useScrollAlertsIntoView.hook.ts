"use client";

import { useCallback, useEffect, useRef } from "react";
import { scrollIntoViewIfHidden } from "@/shared/utils/dom/scrollIntoViewIfHidden";

/**
 * Scrolls an error that appears inside a scroll area into view. In a long dialog the form-level
 * error ("A default rule already exists") shows up below the fold after Save; without this the
 * person has to scroll to find out why nothing happened. Returns the ref to put on the scroll area.
 * Every `role="alert"` added to it is covered, so no form has to opt in.
 */
export function useScrollAlertsIntoView<T extends HTMLElement>() {
  const observerRef = useRef<MutationObserver | null>(null);

  const ref = useCallback((node: T | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    if (!node || typeof MutationObserver === "undefined") return;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((added) => {
          if (!(added instanceof Element)) return;
          const alert = added.matches('[role="alert"]')
            ? added
            : added.querySelector('[role="alert"]');
          scrollIntoViewIfHidden(alert);
        });
      }
    });
    observer.observe(node, { childList: true, subtree: true });
    observerRef.current = observer;
  }, []);

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return ref;
}
