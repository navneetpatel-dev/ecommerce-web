"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** CSS margin around the root — prefetch slightly before the block is visible. */
  rootMargin?: string;
  /** When true (default), stay in-view after the first intersection. */
  once?: boolean;
  enabled?: boolean;
}

/**
 * Observe when an element enters the viewport. Used to defer below-fold PDP fetches.
 */
export function useInView<T extends Element = HTMLDivElement>({
  rootMargin = "240px 0px",
  once = true,
  enabled = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (once && inView) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        setInView(true);
        if (once) observer.disconnect();
      },
      { root: null, rootMargin, threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, inView, once, rootMargin]);

  return { ref, inView };
}
