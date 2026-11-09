export const cashbackHistoryPageStyles = {
  container: "storefront-container max-w-4xl space-y-8 py-8 md:py-10",
  header: "space-y-2",
  title:
    "mt-1.5 font-display text-ink leading-[1.1] tracking-tight text-display-sm",
  subtitle: "text-body text-ink-muted",
  totals: "grid grid-cols-1 gap-3 sm:grid-cols-2",
  total: "border border-line bg-surface-raised p-4",
  totalLabel:
    "text-caption font-semibold uppercase tracking-wide text-ink-muted",
  totalValue: "mt-1 font-display text-[1.5rem] tabular-nums text-ink",
  totalValueBrand: "mt-1 font-display text-[1.5rem] tabular-nums text-brand",
  orderLink: "font-mono text-body-sm text-brand hover:underline",
  source: "flex flex-col text-body-sm",
  muted: "text-ink-muted",
} as const;
