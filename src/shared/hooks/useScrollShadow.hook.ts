"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseScrollShadowOptions {
  /** Scroll position (px) past which the shell counts as scrolled. */
  threshold?: number;
}

/**
 * Tracks whether a scroll container has been scrolled past `threshold`,
 * re-evaluating on scroll, window resize, and element resize. All listener
 * setup/cleanup lives in this hook (Rule 14) so components stay presentational.
 */
export function useScrollShadow({
  threshold = 4,
}: UseScrollShadowOptions = {}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  const updateScrolled = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setScrolled(el.scrollLeft > threshold);
  }, [threshold]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrolled();

    el.addEventListener("scroll", updateScrolled, { passive: true });
    window.addEventListener("resize", updateScrolled);

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateScrolled)
        : null;
    observer?.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrolled);
      window.removeEventListener("resize", updateScrolled);
      observer?.disconnect();
    };
  }, [updateScrolled]);

  return { scrollRef, scrolled };
}
