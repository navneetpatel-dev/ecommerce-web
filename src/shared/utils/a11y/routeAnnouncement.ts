import { LABELS } from "@/shared/constants/labels";

/** Elements that mean the user is mid-input; focus must not be yanked away. */
const TYPING_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

/** Overlays that own focus themselves (Radix dialog/menu/listbox). */
const OVERLAY_SELECTOR = '[role="dialog"],[role="menu"],[role="listbox"]';

/**
 * What the live region says after a client-side navigation. The page's own
 * heading is the most useful label; the document title is the fallback.
 */
export function announcementForPageTitle(title: string | null | undefined) {
  const clean = (title ?? "").replace(/\s+/g, " ").trim();
  return clean || LABELS.pageLoadedFallback;
}

/**
 * Client-side navigations do not move focus, so it stays on the link the user
 * clicked (or wherever they were) — screen-reader and keyboard users then walk
 * the page from the wrong place. Focus the new page body instead, except when
 * the user is typing (a debounced filter navigation) or an overlay owns focus.
 */
export function shouldMoveFocusToMain(activeElement: Element | null) {
  if (!activeElement || activeElement === document.body) return true;
  if (TYPING_TAGS.has(activeElement.tagName)) return false;
  if (activeElement.hasAttribute("contenteditable")) return false;
  return activeElement.closest(OVERLAY_SELECTOR) === null;
}

/**
 * A pathname change is a navigation; a hash-only change is an in-page jump the
 * browser already handles, and it must stay silent.
 */
export function isClientNavigation(
  previousPathname: string,
  nextPathname: string,
  hash: string,
) {
  return previousPathname !== nextPathname && hash === "";
}
