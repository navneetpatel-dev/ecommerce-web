export const PRODUCT_SPECIFICATIONS_STYLES = {
  root: "space-y-6",
  list: "divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface",
  row: "grid grid-cols-[8rem_1fr] gap-3 px-4 py-3 sm:grid-cols-[10rem_1fr]",
  label: "text-body-sm font-medium text-ink-muted",
  value: "text-body text-ink",
  categoriesContainer: "space-y-2",
  categoriesTitle:
    "text-body-sm font-semibold uppercase tracking-[0.08em] text-ink-muted",
  categoriesList: "flex flex-wrap gap-2",
  categoryChip:
    "rounded-full border border-line bg-paper px-3 py-1 text-body-sm text-ink-muted transition-colors hover:border-brand hover:text-brand",
} as const;
