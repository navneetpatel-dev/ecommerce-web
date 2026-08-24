"use client";

import { useCallback, useRef, type MouseEvent as ReactMouseEvent } from "react";

/**
 * Swallows exactly one click after a gesture (zoom release / swipe) so the
 * pointer-up does not also activate the element underneath. Used by the
 * gallery stage; isolated here because it is a distinct micro-concern
 * (Rule 3) with its own ref lifetime.
 */
export function useSwallowNextClick() {
  const swallowClickRef = useRef(false);

  const arm = useCallback(() => {
    swallowClickRef.current = true;
  }, []);

  const onClickCapture = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    if (!swallowClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    swallowClickRef.current = false;
  }, []);

  return { arm, onClickCapture };
}
