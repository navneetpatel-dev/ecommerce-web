export const cartPageViewStyles = {
  root: "relative",
  ambientGradient:
    "pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]",
  container: "storefront-container relative py-6 md:py-8",
  header: "flex items-end justify-between gap-4",
  headerDetails: "min-w-0",
  title:
    "mt-1.5 font-display text-ink leading-[1.1] tracking-tight [font-size:var(--text-display-sm)]",
  mutationErrorMargin: "mt-4",
  layoutGrid: "mt-6 grid grid-cols-1 gap-8 lg:mt-8 lg:grid-cols-12 lg:gap-10",
  mainItemsColumn: "lg:col-span-7 xl:col-span-8",

  // OrderSummaryAside styles
  aside:
    "lg:col-span-5 xl:col-span-4 lg:sticky lg:top-[88px] lg:self-start lg:z-10",
  asideCard:
    "relative border border-line bg-surface-raised p-5 shadow-elevation-1",
  asideAccentBar:
    "pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand via-brand/70 to-transparent",
  asideItemCountRow: "text-[0.875rem] text-ink-muted",
  asideItemCountDot: "mx-2 text-line",
  asideItemTotalBold: "font-medium text-ink",
  asideEyebrow: "mt-4",
  asideTitle: "mt-1 font-display text-[1.25rem] text-ink",
  asideDivider: "mt-4 border-t border-line pt-4",
  asideTotalRow: "flex items-end justify-between gap-4",
  asideTotalLabel: "text-[0.875rem] font-medium text-ink",
  asideTotalAmount:
    "font-display text-[1.5rem] leading-none tabular-nums text-brand",
  asideTotalFallback: "text-[1rem]",
  asideUnavailableNotice: "mt-3",
  asideCashbackNotice: "mt-3 text-body-sm text-brand",
  asideWarningBanner:
    "mt-4 rounded-sm bg-warning-subtle px-3 py-2 text-body-sm text-warning-foreground",
  asideCheckoutButton: "mt-5 w-full",
  asideCheckoutLink: "inline-flex items-center justify-center gap-2",
  asideFooterNote: "mt-3 text-center text-[0.75rem] text-ink-muted",

  // OrderSummaryTotalsList styles
  totalsList: "mt-5 space-y-2.5 text-[0.875rem]",
  totalsRow: "flex items-center justify-between gap-4",
  totalsLabel: "text-ink-muted",
  totalsValue: "tabular-nums text-ink",
  discountRow: "flex items-center justify-between gap-4 text-success",
  vendorBreakdownRow:
    "flex items-center justify-between gap-4 pl-2 text-body-sm text-success",
} as const;
