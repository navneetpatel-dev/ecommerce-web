/** Storefront banner shown while the browser reports no connection. */
export const offlineNoticeStyles = {
  // Sticky to the top of the viewport, so it offsets itself by the status bar /
  // notch inset the same way the auth notice and header do.
  root: "sticky top-0 z-[60] flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-b border-warning/40 bg-warning-subtle px-4 pb-2 pt-[calc(0.5rem+env(safe-area-inset-top,0px))] text-center text-body-sm text-ink",
  title: "font-semibold",
  body: "text-ink-muted",
} as const;

/** The cached page the service worker falls back to when a navigation fails. */
export const offlinePageStyles = {
  page: "storefront-container flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center",
  heading: "text-h2 font-semibold text-ink",
  body: "max-w-md text-body text-ink-muted",
  actions: "flex flex-wrap items-center justify-center gap-3",
  primaryAction:
    "inline-flex h-11 items-center rounded-md bg-brand px-5 text-body font-medium text-paper transition-colors hover:bg-brand-hover",
} as const;
