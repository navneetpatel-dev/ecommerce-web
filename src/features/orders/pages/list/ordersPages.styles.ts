export const ordersPagesStyles = {
  // OrderHistoryPage
  historyLoadingContainer: "storefront-container space-y-3 py-8",
  historySkeletonSmall: "h-8 w-28",
  historySkeletonHeader: "mb-6 h-12 w-48",
  historySkeletonRow: "h-16 w-full",
  historyErrorContainer: "storefront-container py-8",
  historyErrorBox:
    "border border-line bg-surface-raised px-5 py-10 text-center",
  historyErrorText: "text-body text-ink-muted",
  historyRetryButton:
    "mt-2 text-[0.875rem] font-medium text-brand underline-offset-4 hover:underline",

  // TrackingLookupPage
  trackingContainer: "max-w-md mx-auto px-4 py-8 space-y-4",
  trackingTitle: "text-[1.375rem] font-semibold text-ink",
  trackingError: "text-body-sm text-danger",

  // OrderDetailPage
  detailNotFoundWrapper: "relative",
  detailNotFoundGlow:
    "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]",
  detailNotFoundContainer: "storefront-container relative py-16 md:py-20",
  detailNotFoundFooter: "mt-4 text-center text-body-sm text-ink-faint",
  detailContinueShoppingLink: "text-brand underline-offset-2 hover:underline",
} as const;
