export const analyticsStyles = {
  // MetricCard
  metricCardBase:
    "rounded-lg border border-line bg-paper/50 p-4 transition-all duration-200 hover:border-line-strong hover:bg-paper/70",
  metricCardHighlight: "border-brand/30 bg-brand/[0.04]",
  metricCardTitle:
    "text-body-xs font-medium uppercase tracking-wider text-ink-muted",
  metricCardValue:
    "mt-1.5 text-xl font-bold tabular-nums tracking-tight text-ink",
  metricCardValueHighlight: "text-brand",

  // AnalyticsMetricsGrid
  grid4Cols: "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4",
  grid2Cols: "grid grid-cols-2 gap-3 lg:grid-cols-4",

  // Shared Card & Charts
  fullHeightCard: "h-full",
  cardHeaderPb2: "pb-2",
  cardTitleLg: "text-body-lg",
  emptyRatingNotice: "py-12 text-center text-body text-ink-muted",
  ratingChartContainer: "h-56 w-full sm:h-64",

  // AnalyticsStatusChart
  statusChartFlex:
    "flex flex-col items-center gap-4 sm:flex-row sm:items-stretch",
  donutWrapper: "relative h-44 w-full max-w-[11.5rem] shrink-0 sm:h-48",
  donutCenter:
    "pointer-events-none absolute inset-0 flex flex-col items-center justify-center",
  donutTotal: "font-mono text-[1.25rem] font-semibold text-ink",
  donutLabel: "text-[0.6875rem] uppercase tracking-wide text-ink-faint",
  legendList: "flex w-full flex-1 flex-col justify-center gap-2.5",
  legendItem: "flex items-center justify-between gap-3",
  legendLabelGroup: "flex min-w-0 items-center gap-2",
  legendDot: "h-2.5 w-2.5 shrink-0 rounded-full",
  legendLabelText: "max-w-full truncate",
  legendValueGroup: "shrink-0 text-right",
  legendValue: "font-mono text-[0.875rem] font-medium text-ink",
  legendPercent: "text-[0.6875rem] text-ink-faint",

  // AnalyticsTrendTooltip
  tooltipBox:
    "rounded-md border border-line bg-surface px-3 py-2 shadow-elevation-2",
  tooltipTitle: "mb-1.5 text-body-sm font-medium text-ink",
  tooltipList: "space-y-1",
  tooltipItem:
    "flex items-center justify-between gap-6 text-body-sm text-ink-muted",
  tooltipSeries: "flex items-center gap-2",
  tooltipDot: "h-2 w-2 rounded-full",
  tooltipValue: "font-mono font-medium text-ink",

  // AnalyticsTrendChart
  trendCardContent: "pt-2",
  trendEmpty: "py-16 text-center text-body text-ink-muted",
  trendChartContainer: "h-72 w-full min-w-0 sm:h-80",

  // AnalyticsMetricCard
  metricCardOverflow:
    "overflow-hidden transition-shadow hover:shadow-elevation-2",
  metricCardToneBrand:
    "border-brand/25 bg-gradient-to-br from-brand-subtle/80 to-surface",
  metricCardToneWarning: "border-warning/20",
  metricIconWrap:
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
  metricIconToneBrand: "bg-brand/15 text-brand",
  metricIconToneDefault: "bg-paper text-ink-muted",
  metricTrendBase: "font-medium tabular-nums",
  trendSuccess: "text-success",
  trendDanger: "text-danger",
  trendMuted: "text-ink-muted",
  metricCardContent: "flex flex-col gap-3 p-5",
  metricHeader: "flex items-start justify-between gap-3",
  metricTitle: "text-body-sm font-medium text-ink-muted",
  metricIcon: "h-4 w-4",
  metricValue:
    "font-mono text-[1.5rem] font-semibold tracking-tight text-ink sm:text-[1.625rem]",
  metricFooter: "flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.75rem]",
  metricFaint: "text-ink-faint",
} as const;
