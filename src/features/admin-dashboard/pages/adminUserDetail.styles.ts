export const adminUserDetailStyles = {
  skeleton: "space-y-3 py-4",
  emptyBox: "border border-line bg-surface-raised px-5 py-10 text-center",
  pageRoot: "w-full min-w-0 space-y-5",
  backLink:
    "inline-flex items-center gap-1.5 text-body-sm font-medium text-ink-muted hover:text-ink",
  headerRow:
    "flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4",
  headerInfo: "min-w-0 space-y-1",
  title:
    "font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl",
  emailText: "text-body-sm text-ink-muted",
  actionsRow: "flex flex-wrap items-center gap-3",
  gridTwoCols: "grid gap-6 md:grid-cols-2",
  cardSection: "space-y-3 border border-line bg-surface-raised p-4",
  cardSectionTitle:
    "text-body-sm font-semibold uppercase tracking-wide text-ink-muted",
  dlGrid: "grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-body-sm",
  dt: "text-ink-muted",
  dd: "text-ink",
  ddFlex: "flex items-center gap-2 text-ink",
  manageRoleLink:
    "text-xs text-brand underline underline-offset-2 hover:text-brand-hover",
} as const;

export const userAddressesCardStyles = {
  addressItem: "text-body-sm text-ink",
  addressMeta: "text-ink-muted",
  list: "space-y-3",
  empty: "text-body-sm text-ink-muted",
  section: "space-y-3 border border-line bg-surface-raised p-4",
  title: "text-body-sm font-semibold uppercase tracking-wide text-ink-muted",
} as const;

export const userRecentOrdersCardStyles = {
  orderItem:
    "flex flex-wrap items-center justify-between gap-3 py-3 text-body-sm",
  orderInfo: "min-w-0",
  orderId: "font-medium text-ink",
  orderDate: "text-ink-muted",
  orderTotal: "tabular-nums text-ink",
  list: "divide-y divide-line",
  empty: "text-body-sm text-ink-muted",
  section: "space-y-3 border border-line bg-surface-raised p-4",
  title: "text-body-sm font-semibold uppercase tracking-wide text-ink-muted",
} as const;
