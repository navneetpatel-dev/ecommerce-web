export const productDetailsMiscStyles = {
  // ProductHighlights
  highlightsSection: "space-y-3",
  highlightsHeading:
    "text-body-sm font-semibold uppercase tracking-[0.08em] text-ink-muted",
  highlightsGrid: "grid gap-2 sm:grid-cols-2",
  highlightsItem:
    "flex items-start gap-2.5 rounded-lg border border-line bg-paper/60 px-3 py-2.5 text-body leading-snug text-ink-muted",
  highlightsBullet: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand",

  // ProductInfo
  productDescription:
    "text-body-lg leading-relaxed text-ink-muted whitespace-pre-wrap",

  // ProductNotFound
  notFoundContainer: "storefront-container py-16 text-center",
  notFoundText: "text-ink-muted text-body-lg",
  notFoundBackButton: "mt-4",

  // RecentlyViewedSection
  recentEyebrow: "mb-2",
  recentTitle: "text-[1.375rem] font-semibold text-ink mb-6",

  // ProductSizeChartButton
  sizeChartButton: "rounded-full",
  sizeChartDialogContent: "max-w-2xl",
  sizeChartImage: "h-auto w-full",
} as const;
