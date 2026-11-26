export const vendorProductImagesDialogStyles = {
  counter: "text-body-sm font-medium tabular-nums text-ink-muted",
  dialogContent: "max-w-3xl",
  loadingText: "text-ink-muted",
  errorText: "text-danger text-body-sm",
  imageList: "grid grid-cols-1 gap-5 sm:grid-cols-2",
  emptyState:
    "rounded-lg border border-dashed border-line-strong/70 bg-paper/30 p-6 text-center text-body-sm text-ink-muted",
  summary: "flex flex-wrap items-center justify-between gap-3",
} as const;

export const productImageRowStyles = {
  card: "flex flex-col overflow-hidden rounded-lg border border-line bg-surface",
  media: "relative aspect-square w-full overflow-hidden bg-paper",
  mediaImg: "object-cover",
  mainBadge:
    "absolute left-3 top-3 inline-flex items-center gap-1 rounded-sm bg-brand px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-paper",
  starIcon: "size-3.5",
  body: "flex flex-1 flex-col gap-4 p-4",
  meta: "flex items-center justify-between gap-2",
  metaText: "text-body-sm text-ink-muted",
  actions: "flex flex-wrap items-center gap-2",
  actionsSpacer: "ml-auto",
} as const;
