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
} as const;
