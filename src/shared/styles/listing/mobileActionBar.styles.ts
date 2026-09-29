/**
 * Sticky mobile action bar for listing surfaces (filters / sort / compare).
 *
 * Two visual densities exist because two listing pages were built with slightly
 * different spacing; the behaviour is shared, the spacing stays per surface.
 *   - `comfortable` — product listing (more vertical padding, no truncation)
 *   - `dense`       — category listing (tighter bar, labels truncate)
 */
export const mobileActionBarStyles = {
  root: {
    comfortable:
      "sticky top-14 z-20 -mx-4 mb-6 border-y border-line bg-paper/95 px-4 py-3 backdrop-blur-sm xl:hidden lg:top-[72px]",
    dense:
      "sticky top-14 z-20 -mx-4 mb-3 border-y border-line bg-paper/95 px-4 py-2 backdrop-blur-sm xl:hidden lg:top-[72px]",
  },
  row: {
    comfortable: "flex items-center gap-2",
    dense: "flex items-center gap-1.5 sm:gap-2",
  },
  button: {
    comfortable: "flex-1 gap-1.5",
    dense: "min-w-0 flex-1 gap-1 px-2 sm:gap-1.5 sm:px-4",
  },
  /** Only the dense bar wraps its labels; it needs them to truncate. */
  buttonText: "truncate",
} as const;

export type MobileActionBarVariant = keyof typeof mobileActionBarStyles.root;
