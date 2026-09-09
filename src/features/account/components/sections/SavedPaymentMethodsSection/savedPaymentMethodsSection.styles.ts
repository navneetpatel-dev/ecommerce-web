export const savedPaymentMethodsSectionStyles = {
  container: "space-y-5",
  description: "text-[0.875rem] text-ink-muted",
  skeletonContainer: "space-y-3",
  skeletonItem: "h-16 w-full",
  emptyWrapper: "border border-dashed border-line bg-paper/50",
  emptyState: "py-12 md:py-14",
  listGrid: "grid gap-3 sm:grid-cols-2",
  card: "flex items-center justify-between gap-3 border border-line bg-paper p-4",
  cardContent: "flex min-w-0 items-center gap-3",
  iconBox:
    "grid size-10 shrink-0 place-items-center border border-line bg-paper/60 text-ink-muted",
  cardDetails: "min-w-0",
  cardTitle: "truncate text-[0.9rem] font-medium text-ink",
  cardSubtitle: "truncate text-[0.8rem] text-ink-muted",
  listErrorNotice: "text-[0.875rem] text-danger",
} as const;
