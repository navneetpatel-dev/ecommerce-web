export const ordersActivitySectionStyles = {
  container: "space-y-6",
  recentSection: "border border-line bg-surface shadow-elevation-1",
  header:
    "flex items-start justify-between gap-4 border-b border-line bg-paper/65 px-5 py-4 md:px-6",
  headerDetails: "min-w-0",
  heading:
    "mt-1 font-display text-[1.1875rem] leading-tight tracking-tight text-ink",
  headerSubtitle: "mt-1 text-body-sm text-ink-muted",
  viewAllLink:
    "inline-flex shrink-0 items-center gap-1 self-center text-body-sm font-medium text-brand hover:text-brand-hover",
  skeletonContainer: "space-y-3 p-5",
  skeletonItem: "h-14 w-full",
  emptyText: "px-5 py-10 text-center text-body text-ink-muted",
  emptyLink: "font-medium text-brand hover:underline",
  ordersList: "divide-y divide-line",
  orderRow:
    "flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-paper md:px-6",
  orderInfo: "min-w-0",
  orderId: "font-medium text-ink",
  orderSummary: "mt-0.5 truncate text-body-sm text-ink-muted",
  orderDate: "mt-0.5 text-[0.75rem] text-ink-faint",
  orderAmount: "shrink-0 font-medium tabular-nums text-ink",
  summariesList:
    "divide-y divide-line border border-line bg-surface shadow-elevation-1",
} as const;
