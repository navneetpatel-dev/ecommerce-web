/**
 * Skip link (WCAG 2.4.1). Off-screen until focused, then pinned to the top of
 * the viewport, clear of the status bar/notch because `viewport-fit=cover`
 * extends the page under it.
 */
export const skipToContentLinkStyles = {
  link: "sr-only focus:not-sr-only focus:fixed focus:z-[200] focus:rounded-sm focus:border focus:border-line focus:bg-surface-raised focus:px-4 focus:py-2 focus:text-body focus:font-medium focus:text-ink focus:shadow-elevation-3 focus:outline-2 focus:outline-offset-2 focus:outline-brand focus:left-[max(1rem,env(safe-area-inset-left,0px))] focus:top-[max(1rem,env(safe-area-inset-top,0px))]",
  /** Applied to every `<main>` so the link has a real, focusable target. */
  main: "outline-none",
} as const;
