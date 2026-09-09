export const productReviewsStyles = {
  emptyClass: "px-0 py-8",
  list: "max-w-[65ch] divide-y divide-line",
  article: "py-6 first:pt-0",
  header: "flex items-center justify-between gap-4",
  userGroup: "space-y-1",
  userName: "text-body font-medium text-ink",
  verifiedBadge:
    "rounded-sm bg-success-subtle px-2 py-1 text-body-sm font-medium text-success",
  reviewTitle: "mt-4 text-[1.125rem] font-semibold text-ink",
  reviewBody:
    "mt-2 text-body leading-relaxed text-ink-muted whitespace-pre-wrap",
  sellerResponse: "mt-4 ml-4 border-l-2 border-line pl-4",
  sellerTitle: "text-body-sm font-medium text-ink",
  sellerDate: "ml-2 font-normal text-ink-muted",
  sellerBody:
    "mt-1 text-body-sm leading-relaxed text-ink-muted whitespace-pre-wrap",
  voteRow: "mt-4 flex items-center gap-2",
  voteIcon: "h-4 w-4",
} as const;
