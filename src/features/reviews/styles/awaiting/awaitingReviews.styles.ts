export const awaitingReviewsStyles = {
  container: "storefront-container py-8 md:py-10",
  backLink:
    "inline-flex items-center gap-1.5 text-body-sm font-medium text-ink-muted transition-colors hover:text-ink",
  backIcon: "h-4 w-4",
  header: "mt-4 mb-8 flex flex-wrap items-end justify-between gap-4",
  headerText: "max-w-2xl",
  title: "font-display text-[1.75rem] text-ink md:text-[2rem]",
  subtitle: "mt-2 text-body text-ink-muted",
  countPill:
    "inline-flex items-center rounded-full border border-line bg-surface px-3 py-1 text-body-sm font-medium text-ink tabular-nums",
  grid: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
  // Product row on top, one full-width action below it: the thumbnail and text
  // always share a centre line, and every card's button sits on the same baseline.
  card: "flex h-full flex-col gap-4 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-line-strong",
  product: "flex items-center gap-4",
  thumb:
    "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-paper sm:h-20 sm:w-20",
  thumbImage: "object-cover",
  body: "min-w-0 flex-1",
  name: "line-clamp-2 text-body font-medium text-ink",
  meta: "mt-1 text-body-sm text-ink-muted",
  actionButton: "mt-auto w-full gap-2",
  actionIcon: "h-4 w-4",
  skeletonGrid: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
  skeleton: "h-40 w-full rounded-2xl",
  stateBox: "rounded-2xl border border-dashed border-line bg-paper/50",
  emptyState: "py-14",
} as const;
