export const vendorSummaryGridStyles = {
  grid: "grid grid-cols-2 md:grid-cols-4 gap-4",
  revenueValue: "text-success",
} as const;

export const vendorRevenueChartStyles = {
  tooltipCard:
    "rounded-md border border-line bg-surface px-3 py-2 shadow-elevation-2",
  tooltipLabel: "mb-1 text-body-sm font-medium text-ink",
  tooltipValue: "font-mono text-body-sm text-ink-muted",
  emptyChart: "py-16 text-center text-body text-ink-muted",
  chartContainer: "h-72 w-full min-w-0",
  cardHeader: "pb-2",
  cardTitle: "text-body-lg",
  cardContent: "pt-2",
} as const;

export const vendorFulfillmentSlaStyles = {
  cardHeader: "pb-2",
  cardTitle: "text-body-lg",
  cardContent: "space-y-4 pt-0",
  row: "flex items-center justify-between",
  metricLabel: "text-body-sm text-ink-muted",
  onTimeValue: "font-mono text-[1.375rem] font-bold text-success",
  progressBarWrapper: "h-2 w-full overflow-hidden rounded-full bg-line",
  progressBarFill: "h-full rounded-full bg-success",
  lateValue: "font-mono text-body font-medium text-danger",
} as const;
