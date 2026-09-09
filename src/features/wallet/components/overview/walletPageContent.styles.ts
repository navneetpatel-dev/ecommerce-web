export const walletPageContentStyles = {
  cardContainer:
    "relative border border-line bg-surface-raised p-5 shadow-elevation-1 md:p-6",
  accentStripe:
    "pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand via-brand/70 to-transparent",
  balanceAmount:
    "mt-2 font-display text-[2rem] leading-none tabular-nums text-brand md:text-[2.25rem]",
  balanceSubtext: "mt-3 text-[0.875rem] text-ink-muted",
  breakdownGrid: "mt-4 grid gap-3 sm:grid-cols-2",
  breakdownCard: "rounded-md border border-line/80 bg-paper/40 px-3 py-2.5",
  breakdownLabel: "text-[0.75rem] text-ink-faint",
  breakdownValue: "mt-0.5 text-body font-semibold tabular-nums text-ink",
} as const;
