/**
 * Mobile bottom-rail offsets (design spec §3.3). The tab bar is the fixed
 * 3.5rem rail at the bottom of the storefront; every other element that floats
 * above it measures from the same numbers, so raising the bar cannot silently
 * collide with (or leave a gap in) the sticky bars, compare bar and toasts.
 *
 * Tailwind cannot build class names at runtime, so these are whole class
 * strings rather than numeric tokens. Every one of them carries the
 * `env(safe-area-inset-bottom)` offset that `viewport-fit=cover` makes real.
 */

/** Height of the tab bar itself (`min-h-14` = 3.5rem). */
export const MOBILE_TAB_BAR_HEIGHT_CLASS = "min-h-14";

/** Padding that keeps scrolled page content clear of the bar and home indicator. */
export const CONTENT_CLEARANCE_CLASS =
  "pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))]";

/** Bottom offset for a bar sitting directly on top of the tab bar. */
export const ABOVE_TAB_BAR_CLASS =
  "bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))]";

/** Bottom offset for floating cards and toasts, with a gap above the bar. */
export const ABOVE_TAB_BAR_GAP_CLASS =
  "bottom-[calc(4rem+env(safe-area-inset-bottom,0px))]";
