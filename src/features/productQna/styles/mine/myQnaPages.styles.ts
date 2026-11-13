/** "My questions" / "My answers" — same shell as "Your reviews". */
export const myQnaPagesStyles = {
  container: "storefront-container py-8 md:py-10",
  header: "mb-6 max-w-2xl",
  title: "font-display text-[1.75rem] text-ink md:text-[2rem]",
  subtitle: "mt-2 text-body text-ink-muted",
  countText: "mb-3 text-body-sm text-ink-muted tabular-nums",
  skeletonStack: "space-y-3",
  skeleton: "h-28 w-full",
  stateBox: "border border-dashed border-line bg-paper/50",
  emptyState: "py-14",
  list: "divide-y divide-line border border-line bg-surface-raised",
  item: "px-4 py-5 sm:px-5",
  itemHeader: "flex flex-wrap items-start justify-between gap-3",
  productLink:
    "text-body-sm font-medium text-brand underline-offset-4 hover:underline",
  productFallback: "text-body-sm font-medium text-ink-muted",
  actions: "flex items-center gap-2",
  editButton: "h-8 gap-1.5 rounded-full px-3",
  editIcon: "h-4 w-4",
  questionText: "mt-2 text-body font-medium leading-relaxed text-ink",
  quotedQuestion:
    "mt-2 border-l-2 border-line pl-3 text-body-sm text-ink-muted line-clamp-2",
  answerBody: "mt-2 text-body leading-relaxed text-ink whitespace-pre-wrap",
  meta: "mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-body-sm text-ink-muted",
  editedTag: "text-[0.75rem] italic text-ink-faint",
} as const;
