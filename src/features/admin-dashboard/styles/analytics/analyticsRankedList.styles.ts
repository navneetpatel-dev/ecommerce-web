export const analyticsRankedListStyles = {
  card: "h-full",
  header: "pb-2",
  title: "text-body-lg",
  emptyText: "py-8 text-center text-body text-ink-muted",
  list: "space-y-4",
  itemContainer: "space-y-1.5",
  itemHeader: "flex items-baseline justify-between gap-3",
  itemLabelRow: "flex min-w-0 items-baseline gap-2",
  rankIndex: "w-4 shrink-0 font-mono text-[0.75rem] text-ink-faint",
  itemLabel: "truncate text-body font-medium text-ink",
  itemRevenue: "shrink-0 font-mono text-[0.875rem] text-ink",
  barTrack: "ml-6 h-1.5 overflow-hidden rounded-full bg-paper",
  barFill:
    "h-full rounded-full bg-brand transition-[width] duration-500 ease-out",
  shareText: "ml-6 text-[0.6875rem] text-ink-faint",
} as const;
