export const deliveryListPageStyles = {
  container: "w-full min-w-0 space-y-6",
  header:
    "flex flex-col gap-2 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between",
  title: "font-display text-[1.75rem] text-ink",
  subtitle: "mt-1 text-body text-ink-muted",
  headerActions: "flex items-center gap-3",
  headerCount: "text-body-sm text-ink-muted",
  errorNotice: "text-body-sm text-danger",
  successNotice: "text-body-sm text-success",
  loadingText: "text-ink-muted",
  emptyNotice: "border-l-2 border-brand/30 pl-3 text-body text-ink-muted py-2",
  grid: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
  stopCard: "space-y-2 rounded-md border border-brand/30 bg-brand/5 p-3",
  stopHeader: "flex items-center justify-between gap-2",
  stopTitle: "text-body-sm font-medium text-ink",
  mapLink:
    "inline-flex shrink-0 items-center gap-1 text-body-sm font-medium text-brand hover:underline",
  mapIcon: "size-3.5",
  stopList: "space-y-2",
} as const;
