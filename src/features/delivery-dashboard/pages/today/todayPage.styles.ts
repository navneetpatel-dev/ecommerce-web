export const todayPageStyles = {
  container: "w-full min-w-0 space-y-8",
  header:
    "flex flex-col gap-2 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between",
  queueBadge: "text-body-sm font-medium text-brand",
  title: "mt-1 font-display text-[1.75rem] text-ink",
  subtitle: "mt-1 text-body text-ink-muted",
  grid: "grid gap-8 lg:grid-cols-2",
  section: "space-y-4",
  sectionHeader: "flex items-center justify-between border-b border-line pb-2",
  sectionTitle: "font-display text-[1.125rem] text-ink",
  sectionCount: "text-body-sm text-ink-muted",
  loadingText: "text-ink-muted",
  taskList: "space-y-3",
  emptyText: "border-l-2 border-brand/30 pl-3 text-body text-ink-muted py-2",
} as const;
