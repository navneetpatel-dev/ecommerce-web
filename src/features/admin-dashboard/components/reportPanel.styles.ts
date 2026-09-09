export const reportPanelStyles = {
  container:
    "rounded-lg border border-line bg-surface p-5 md:p-6 shadow-elevation-1 space-y-6",
  header:
    "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4",
  headerLeft: "flex items-center gap-3",
  iconWrapper:
    "flex size-10 items-center justify-center rounded-lg border border-brand/20 bg-brand/10 text-brand shadow-elevation-1",
  icon: "size-5",
  title: "font-display text-[1.125rem] font-semibold text-ink",
  subtitle: "text-body-sm text-ink-muted",
  filterCard: "rounded-lg border border-line bg-paper/40 p-4",
  filterFlex: "flex flex-col lg:flex-row lg:items-end gap-4 justify-between",
  buttonGroup: "flex-wrap items-center gap-2",
  buttonHintWrapper: "w-full sm:w-auto",
  loadingWrapper: "flex items-center justify-center py-10",
  loadingText: "text-body text-ink-muted",
  emptyState:
    "flex flex-col items-center justify-center rounded-lg border border-dashed border-line bg-paper/30 py-12 px-4 text-center",
  emptyIconWrapper:
    "mb-3 flex size-12 items-center justify-center rounded-full border border-line bg-surface text-ink-muted shadow-elevation-1",
  emptyIcon: "size-6",
  emptyTitle: "font-display text-body font-medium text-ink",
  emptySubtitle: "text-body-sm text-ink-muted mt-1 max-w-sm",
} as const;
