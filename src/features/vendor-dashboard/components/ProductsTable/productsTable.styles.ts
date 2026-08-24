/** Named class groups for the vendor products table (Rule 5). */
export const productsTableHeaderStyles = {
  wrapper: "mb-4 space-y-2",
  topRow: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
  titleGroup: "flex flex-col gap-3 sm:flex-row sm:items-center",
  heading: "text-h2 font-semibold text-ink",
  hint: "text-body-sm text-ink-muted",
} as const;

export const productMobileCardStyles = {
  card: "rounded-md border border-line bg-surface p-4 shadow-card-hairline",
  topRow: "flex items-start justify-between gap-3",
  name: "truncate text-body font-medium text-ink",
  sku: "font-mono text-body-sm text-ink-muted",
  metaGrid:
    "mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-line/80 pt-3 text-[0.875rem]",
  metaLabel:
    "text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted",
  metaValue: "text-ink",
  metaValueLow: "text-danger font-medium",
  metaValueMono: "font-mono text-ink",
} as const;

export const productsTableContentStyles = {
  empty:
    "rounded-md border border-line bg-surface px-4 py-14 text-center text-ink-muted",
  mobileList: "space-y-3 lg:hidden",
} as const;
