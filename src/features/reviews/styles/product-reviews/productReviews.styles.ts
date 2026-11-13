export const productReviewsStyles = {
  // States
  emptyClass: "px-0 py-8",
  stateMaxWidth: "max-w-[65ch]",

  // PDP section layout: summary aside + list
  section: "grid gap-8 lg:grid-cols-12 lg:gap-12",
  aside: "lg:col-span-4",
  asideSticky: "lg:sticky lg:top-28",
  main: "min-w-0 lg:col-span-8",
  listHeader:
    "flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-4",
  listTitle: "text-[1.125rem] font-semibold text-ink",
  listHint: "text-body-sm text-ink-muted",
  viewAllRow: "mt-6 flex",
  viewAllButton: "w-full gap-2 sm:w-auto",
  viewAllIcon: "h-4 w-4",

  // Summary card
  summaryCard: "rounded-2xl border border-line bg-surface p-5 sm:p-6",
  summaryEyebrow: "text-eyebrow",
  averageRow: "mt-3 flex items-end gap-4",
  averageValue: "font-display text-[3rem] leading-none tracking-tight text-ink",
  averageMeta: "space-y-1 pb-1",
  countText: "text-body-sm text-ink-muted",
  distribution: "mt-6 space-y-1",
  summaryFooter: "mt-5 border-t border-line pt-4 text-body-sm text-ink-muted",

  // Distribution row
  distRow:
    "grid grid-cols-[3rem_1fr_2.75rem] items-center gap-3 rounded-md px-2 py-1.5 text-body-sm text-ink-muted transition-colors hover:bg-brand-subtle hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  distRowActive: "bg-brand-subtle text-ink",
  distLabel: "inline-flex items-center gap-1 font-medium tabular-nums",
  distStar: "h-3.5 w-3.5 fill-brand text-brand",
  distTrack: "block h-2 overflow-hidden rounded-full bg-line/60",
  distFill: "block h-full rounded-full bg-brand",
  distCount: "text-right tabular-nums",

  // Review item
  list: "divide-y divide-line",
  article: "py-6",
  pinnedArticle:
    "my-4 rounded-2xl border border-brand/30 bg-brand-subtle/50 px-4 sm:px-5",
  mineTag:
    "rounded-full border border-brand/40 bg-brand-subtle px-2 py-0.5 text-[0.75rem] font-medium text-brand",
  pendingTag:
    "rounded-full bg-warning-subtle px-2 py-0.5 text-[0.75rem] font-medium text-warning",
  articleHeader: "flex items-start gap-3",
  avatar:
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-body-sm font-semibold text-brand",
  authorBlock: "min-w-0 flex-1",
  authorRow: "flex flex-wrap items-center gap-x-3 gap-y-1",
  userName: "text-body font-medium text-ink",
  verified:
    "inline-flex items-center gap-1 text-body-sm font-medium text-success",
  verifiedIcon: "h-3.5 w-3.5",
  ratingRow: "mt-1 flex flex-wrap items-center gap-2",
  reviewDate: "text-body-sm text-ink-muted",
  editedTag: "text-[0.75rem] italic text-ink-faint",
  reviewTitle: "mt-4 text-body-lg font-semibold text-ink",
  reviewBody:
    "mt-1.5 text-body leading-relaxed text-ink-muted whitespace-pre-wrap",
  sellerResponse: "mt-4 rounded-lg border border-line bg-paper/60 px-4 py-3",
  sellerTitle:
    "flex flex-wrap items-center gap-2 text-body-sm font-medium text-ink",
  sellerIcon: "h-3.5 w-3.5 text-brand",
  sellerDate: "font-normal text-ink-muted",
  sellerBody:
    "mt-1 text-body-sm leading-relaxed text-ink-muted whitespace-pre-wrap",
  voteRow: "mt-4 flex flex-wrap items-center gap-2",
  voteLabel: "mr-1 text-body-sm text-ink-muted",
  voteButton: "h-8 gap-1.5 rounded-full px-3 tabular-nums",
  voteIcon: "h-3.5 w-3.5",
} as const;
