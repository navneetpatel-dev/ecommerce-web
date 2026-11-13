"use client";

import { useEffect } from "react";
import {
  clearAuthReturnScroll,
  peekAuthReturnScroll,
} from "@/shared/utils/auth/authReturn";

/** Give up waiting for the page to grow tall enough after this long. */
const RESTORE_DEADLINE_MS = 4000;

/**
 * After a sign-in detour, puts the visitor back at the scroll offset they left
 * `routePath` at. Data-driven pages render short first, so it waits (one frame
 * at a time) until the document is tall enough, then scrolls once.
 */
export function useAuthReturnScroll(routePath: string) {
  useEffect(() => {
    const target = peekAuthReturnScroll(routePath);
    if (target === null) return;

    const deadline = performance.now() + RESTORE_DEADLINE_MS;
    let frame = 0;

    const tick = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll >= target || performance.now() > deadline) {
        window.scrollTo({
          top: Math.min(target, Math.max(maxScroll, 0)),
          behavior: "auto",
        });
        clearAuthReturnScroll();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [routePath]);
}
