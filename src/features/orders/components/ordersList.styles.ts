export const ORDERS_LIST_STYLES = {
  root: "relative",
  radialBackground:
    "pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]",
  container: "storefront-container relative py-6 md:py-8",
  header: "flex flex-wrap items-end justify-between gap-4",
  heading: "mt-1.5 font-display text-ink leading-[1.1] tracking-tight",
  headingStyle: { fontSize: "var(--text-display-sm)" },
  description: "mt-2 max-w-xl text-body text-ink-muted",
  headerActions: "flex flex-wrap items-center gap-3",
  tableMargin: "mt-8",
  itemsCell: "min-w-0",
  itemsSummary: "truncate text-body text-ink group-hover:text-brand",
  itemsCountText: "mt-0.5 text-[0.75rem] text-ink-faint",
  totalAmount: "font-display text-[1.125rem] tabular-nums text-ink",
  openIcon:
    "ml-auto h-4 w-4 text-ink-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand",
} as const;
