export const adminDeliveryPerformancePanelStyles = {
  root: "rounded-lg border border-line bg-surface p-5 md:p-6 shadow-elevation-1 space-y-6",
  header:
    "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line/60 pb-4",
  headerLeft: "flex items-center gap-2.5",
  headerIcon: "size-5 text-brand",
  title: "font-display text-[1.125rem] font-semibold text-ink",
  subtitle: "text-body-sm text-ink-muted",
  filtersWrapper: "flex flex-wrap items-end gap-3",
  loadingText: "text-body-sm text-ink-muted",
  emptyText: "py-8 text-center text-body-sm text-ink-muted",
  tableWrapper: "overflow-x-auto",
  table: "w-full min-w-[720px] text-body-sm",
  tableHeaderRow: "border-b border-line text-left text-ink-muted",
  tableHeaderCell: "py-2 pr-3 font-medium",
  tableRow: "border-b border-line/60",
  tableCell: "py-2 pr-3",
  tableCellMuted: "py-2 pr-3 text-ink-muted",
  agentNameWrapper: "flex items-center gap-1.5",
  flagBadge:
    "rounded-full border border-danger/30 bg-danger/10 px-1.5 py-0.5 text-caption font-medium text-danger",
  chartContainer: "h-56 w-full sm:h-64",
} as const;
