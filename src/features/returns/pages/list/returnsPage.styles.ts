export const returnsPageStyles = {
  container: "storefront-container py-8 md:py-10",
  header: "mb-8 max-w-2xl",
  title: "font-display text-[1.75rem] text-ink md:text-[2rem]",
  subtitle: "mt-2 text-body text-ink-muted",
  skeletonStack: "space-y-3",
  skeleton: "h-20 w-full",
  errorBox: "border border-line bg-surface-raised px-5 py-10 text-center",
  emptyBox: "border border-dashed border-line bg-paper/50",
  emptyState: "py-14",
  returnsList: "space-y-4",
  returnLink:
    "block transition-colors hover:border-brand/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  backLink:
    "text-body-sm font-medium text-brand underline-offset-4 hover:underline",
  detailSkeleton: "mt-6 space-y-3",
  detailEmptyWrapper: "mt-8",
  detailCardWrapper: "mt-6",
} as const;
