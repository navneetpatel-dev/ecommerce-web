"use client";

import { useLayoutEffect, useRef } from "react";
import {
  markPopNavigation,
  recalledScroll,
  rememberScroll,
  takePopNavigation,
  takePreserveScroll,
} from "@/shared/utils/navigation/scrollMemory";

/** Give up restoring if the page has not grown tall enough by then. */
const RESTORE_DEADLINE_MS = 5000;
const USER_SCROLL_EVENTS = [
  "wheel",
  "touchstart",
  "keydown",
  "mousedown",
] as const;

/**
 * App-wide scroll behaviour on client navigation:
 * - a new page (link, router.push) opens at the top;
 * - Back/Forward returns to where the visitor was on that page — data-driven pages
 *   render short first, so it waits for the height, and yields if they scroll;
 * - in-page URL state (tabs, filters) that opts in keeps the current position.
 */
export function useRouteScrollMemory(routeKey: string) {
  const currentKey = useRef(routeKey);

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    // By the time popstate reaches us the restored route has already rendered;
    // the page being left was recorded by the scroll/click listeners.
    const onPop = () => markPopNavigation();
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        rememberScroll(currentKey.current, window.scrollY),
      );
    };
    // Links: record the position on the way out, before the new page renders.
    const onClickCapture = () =>
      rememberScroll(currentKey.current, window.scrollY);
    // Capture phase: Next handles popstate synchronously (the restored route
    // renders inside its own listener), so ours must run first to mark Back.
    window.addEventListener("popstate", onPop, true);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClickCapture, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("popstate", onPop, true);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  useLayoutEffect(() => {
    currentKey.current = routeKey;
    // Read before anything scrolls: the scroll listener would overwrite it with 0.
    const remembered = recalledScroll(routeKey);
    const keepScroll = takePreserveScroll();
    if (!keepScroll) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    // Next renders a Back/Forward route synchronously inside its own popstate
    // listener — before ours runs — so whether this was a traversal is only known
    // once the event has finished dispatching. Decide on the next frame (before
    // paint, so no visible jump).
    const frame = requestAnimationFrame(() => {
      if (takePopNavigation() && remembered !== null)
        restoreWhenTallEnough(remembered);
    });
    return () => cancelAnimationFrame(frame);
  }, [routeKey]);
}

/** Scrolls to `target` once the document can reach it (or the deadline passes). */
function restoreWhenTallEnough(target: number) {
  const deadline = performance.now() + RESTORE_DEADLINE_MS;
  let frame = 0;
  const stop = () => {
    cancelAnimationFrame(frame);
    for (const type of USER_SCROLL_EVENTS)
      window.removeEventListener(type, stop);
  };
  // The visitor taking over beats any restoring.
  for (const type of USER_SCROLL_EVENTS)
    window.addEventListener(type, stop, { passive: true });

  const tick = () => {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: Math.min(target, Math.max(maxScroll, 0)),
      behavior: "auto",
    });
    if (maxScroll >= target || performance.now() > deadline) {
      stop();
      return;
    }
    frame = requestAnimationFrame(tick);
  };
  tick();
}
