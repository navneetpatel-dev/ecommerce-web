export const vendorGroupHeaderStyles = {
  header:
    "mb-3 flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-2",
  leadingGroup: "flex flex-wrap items-baseline gap-2",
  eyebrow: "!mb-0",
  name: "font-display text-[1.125rem] text-ink",
  vendorLink: "transition-colors hover:text-brand",
  trailingGroup: "flex flex-wrap items-center gap-3",
  countText:
    "font-mono text-[0.6875rem] uppercase tracking-wider text-ink-faint",
} as const;

export const vendorGroupTotalsStyles = {
  container: "mt-1 space-y-2 border-t border-line pt-3.5 text-[0.875rem]",
  row: "flex justify-between gap-4",
  discountRow: "flex justify-between gap-4 text-success",
  totalRow: "flex items-baseline justify-between gap-4 pt-1",
  label: "text-ink-muted",
  value: "tabular-nums text-ink",
  discountValue: "tabular-nums",
  totalLabel: "text-body-sm font-medium text-ink",
  totalValue: "font-display text-[1.125rem] tabular-nums text-brand",
} as const;

export const vendorStripStyles = {
  link: "inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-brand hover:bg-brand-subtle transition-colors",
  sizeMd: "px-3 py-1",
  logo: "rounded-full object-cover",
  avatar:
    "h-5 w-5 rounded-full bg-brand-subtle flex items-center justify-center text-[0.6875rem] font-medium text-brand",
  name: "text-body-sm font-medium",
  nameMd: "text-body",
  ratingWrap: "flex items-center gap-0.5 text-body-sm text-ink-muted",
  star: "h-3.5 w-3.5 fill-warning text-warning",
} as const;

export const orderTaxShippingBreakdownStyles = {
  defaultDl: "space-y-2.5 text-[0.875rem]",
  row: "flex items-center justify-between gap-4",
  label: "text-ink-muted",
  value: "tabular-nums text-ink",
  unreadyTextRight: "text-right text-ink-muted",
} as const;

export const redeliverySlotPickerStyles = {
  container: "space-y-2 rounded-md border border-line bg-surface-muted p-3",
  prompt: "text-body-sm font-medium text-ink",
  controlsRow: "flex gap-2",
  selectTrigger: "min-w-0 flex-1",
} as const;
