export const vendorFeedbackViewsStyles = {
  section: "w-full min-w-0 space-y-6",
  header: "flex flex-col gap-4 border-b border-line/70 pb-6",
  headerInfo: "min-w-0 space-y-1.5",
  title:
    "font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl",
  hint: "max-w-3xl text-body leading-relaxed text-ink-muted",
  loadingStack: "space-y-6",
  skeleton: "h-[8.5rem] w-full rounded-md sm:h-[9.5rem]",
  errorBox:
    "border border-line bg-surface-raised px-5 py-10 text-center text-ink-muted",
  card: "w-full overflow-hidden rounded-md border border-line bg-surface p-4 shadow-card-hairline sm:p-6",
  cardTitle: "font-medium text-ink",
  cardSubtitle: "mt-1 text-body-sm text-ink-muted",
  cardBody: "mt-2 text-body leading-relaxed text-ink-muted",
  actionBtn: "mt-4",
  emptyText: "text-ink-muted",
  reviewHeader: "flex items-start justify-between gap-4",
  flaggedBadge:
    "text-caption rounded border border-warning/30 bg-warning-subtle px-2 py-0.5 font-medium text-warning-foreground",
  flagButton: "h-7 px-2 text-xs text-ink-muted hover:text-ink",
  replyBox:
    "mt-3 space-y-1 rounded-md border border-line bg-surface-raised p-3 text-body-sm",
  replyHeader: "flex items-center justify-between text-xs text-ink-muted",
  replyTitle: "font-semibold text-ink",
  replyBody: "text-ink",
  replyActions: "mt-2 flex gap-2",
  editReplyBtn: "h-7 text-xs",
  removeReplyBtn: "h-7 text-xs text-danger hover:bg-danger/10",
  qnaStack: "space-y-4",
} as const;
