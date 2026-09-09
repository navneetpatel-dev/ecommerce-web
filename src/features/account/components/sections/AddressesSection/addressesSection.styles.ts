export const addressesSectionStyles = {
  container: "space-y-5",
  headerRow: "flex flex-wrap items-center justify-between gap-3",
  summaryText: "text-[0.875rem] text-ink-muted",
  headerAddButton: "gap-2",
  emptyWrapper: "border border-dashed border-line bg-paper/50",
  emptyState: "py-12 md:py-14",
  listGrid: "grid gap-3 sm:grid-cols-2",
  addNewCardButton:
    "h-full min-h-[10rem] max-h-none w-full flex-col gap-2 border-dashed border-line bg-paper/40 p-4 text-ink-muted hover:border-ink/30 hover:bg-paper hover:text-ink",
  addNewCardLabel: "text-[0.875rem] font-medium",
  listErrorNotice: "text-[0.875rem] text-danger",
  skeletonContainer: "space-y-3",
  skeletonItem: "h-28 w-full",
} as const;
