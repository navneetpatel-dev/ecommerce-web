export const agentPayoutsPanelStyles = {
  root: "rounded-lg border border-line bg-surface p-5 md:p-6 shadow-elevation-1 space-y-4",
  header:
    "flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-3",
  headerLeft: "flex items-center gap-2.5",
  headerIcon: "size-5 text-brand",
  title: "font-display text-[1.125rem] font-semibold text-ink",
  pendingBadge:
    "inline-flex items-center rounded-full bg-warning/15 px-2.5 py-0.5 text-caption font-semibold text-warning",
  playIcon: "size-4",
  successAlert:
    "rounded-md border border-success/30 bg-success/10 px-3.5 py-2.5 text-body-sm font-medium text-success",
  errorAlert:
    "rounded-md border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-body-sm font-medium text-danger",
  loadingText: "text-body-sm text-ink-muted",
  emptyText: "py-6 text-center text-body-sm text-ink-muted",
  tableWrapper: "overflow-x-auto",
  table: "w-full min-w-[720px] text-body-sm",
  tableHeaderRow: "border-b border-line text-left text-ink-muted",
  tableHeaderCell: "py-2.5 pr-3 font-medium",
  tableRow: "border-b border-line/60 hover:bg-paper/40 transition-colors",
  tableCellMedium: "py-2.5 pr-3 font-medium",
  tableCellMuted: "py-2.5 pr-3 text-ink-muted",
  tableCellAmount: "py-2.5 pr-3 font-mono font-semibold",
  tableCell: "py-2.5 pr-3",
  pdfButton:
    "inline-flex items-center gap-1 font-medium text-brand hover:underline disabled:opacity-50",
  actionIcon: "size-3.5",
  pendingActionsWrapper: "flex items-center gap-3",
  failButton:
    "inline-flex items-center gap-1 text-body-sm font-medium text-danger hover:underline disabled:opacity-50",
  retryButton:
    "inline-flex items-center gap-1 text-body-sm font-medium text-brand hover:underline disabled:opacity-50",
} as const;
