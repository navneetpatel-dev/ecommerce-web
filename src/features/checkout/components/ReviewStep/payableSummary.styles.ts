export const PAYABLE_SUMMARY_STYLES = {
  root: "relative border border-line bg-surface-raised p-5 shadow-elevation-1",
  accentBorder:
    "pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand via-brand/70 to-transparent",
  row: "mb-3 flex justify-between gap-4 text-[0.875rem]",
  rowLabel: "text-ink-muted",
  rowValue: "tabular-nums text-ink",
  payableRow: "flex items-end justify-between gap-4",
  payableLabel:
    "text-body-sm font-semibold uppercase tracking-[0.08em] text-brand",
  payableHint: "mt-1 text-[0.875rem] text-ink-muted",
  payableAmount:
    "font-display text-[1.75rem] leading-none tabular-nums text-brand",
  couponsList: "mt-3 space-y-1",
  couponLine: "text-body-sm text-success",
  cashbackNotice: "mt-3 text-body-sm text-brand",
  walletFullyCovers: "mt-3 text-body-sm font-medium text-success",
} as const;
