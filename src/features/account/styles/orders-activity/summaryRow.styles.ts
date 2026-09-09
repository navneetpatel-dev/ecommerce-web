export const summaryRowStyles = {
  row: "flex items-center justify-between gap-3 px-5 py-4 md:px-6",
  link: "flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-paper md:px-6",
  iconWrapper: "flex min-w-0 items-center gap-3",
  icon: "shrink-0 text-ink-muted",
  label: "block text-body text-ink",
  valueGroup: "flex items-center gap-2",
  valueText: "text-[0.875rem] font-medium tabular-nums text-ink",
  chevron: "text-ink-muted",
} as const;
