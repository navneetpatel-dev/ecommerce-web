/**
 * Brings an element into view only when it is not already, scrolling the nearest scrollable
 * ancestor (a dialog body, the page). Honours reduced-motion. Safe where `scrollIntoView` is missing.
 */
export function scrollIntoViewIfHidden(element: Element | null): void {
  if (!element || typeof element.scrollIntoView !== "function") return;
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView({
    block: "nearest",
    behavior: reduceMotion ? "auto" : "smooth",
  });
}
