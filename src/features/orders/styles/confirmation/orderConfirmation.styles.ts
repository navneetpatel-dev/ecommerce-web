import {
  HERO_RADIAL_BG,
  STOREFRONT_PAGE_WRAPPER_COMPACT,
} from "@/shared/styles/common.styles";

export const orderConfirmationStyles = {
  root: "relative",
  radialBg: HERO_RADIAL_BG,
  container: STOREFRONT_PAGE_WRAPPER_COMPACT,
  contentWrapper: "mx-auto max-w-6xl",
  grid: "mt-8 grid items-start gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(19rem,1fr)] lg:gap-10",
  mainCol: "min-w-0",
  sectionHeading: "mb-4 mt-1 font-display text-[1.375rem] text-ink",
  errorNotice:
    "border border-line bg-surface-raised p-5 text-center text-body-sm leading-relaxed text-ink-muted",
  disclaimer: "mt-4 text-body-sm leading-relaxed text-ink-faint",
  aside: "min-w-0 lg:sticky lg:top-24",
  asideLoadingCard:
    "space-y-3 border border-line bg-surface-raised p-5 shadow-elevation-1 sm:p-6",
  asidePaidCard:
    "relative border border-line bg-surface-raised p-5 shadow-elevation-1 sm:p-6",
  accentStripe:
    "pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand via-brand/70 to-transparent",
  moneyBreakdown: "space-y-2.5 text-[0.875rem]",
  paymentSummary: "mt-5 border-t border-line pt-5",

  /* Skeleton styles */
  skeletonRoot: "space-y-4",
  skeletonCard:
    "border border-line bg-surface-raised px-4 py-3.5 shadow-elevation-1 sm:px-5",
  skeletonCardHeader:
    "flex items-baseline justify-between gap-3 border-b border-line pb-2",
  skeletonCardBody: "flex items-start gap-3 py-3 sm:gap-4",
  skeletonImage: "size-14 rounded-sm sm:size-16",
  skeletonContent: "flex-1 space-y-2 pt-0.5",
  itemHeaderTitle: "h-4 w-40",
  itemHeaderMeta: "h-3 w-14",
  itemName: "h-4 w-2/3",
  itemQty: "h-3 w-1/4",
  itemPrice: "h-5 w-20",
  asideLabel: "h-4 w-24",
  asideLine1: "h-3 w-full",
  asideLine2: "h-3 w-4/5",
  asideTotal: "mt-4 h-7 w-1/2",

  /* Hero Banner */
  heroRoot:
    "flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10",
  heroInfo: "min-w-0 text-center sm:text-left",
  heroBadgeRow: "flex items-center justify-center gap-2 sm:justify-start",
  heroCheckmark: "m-0 h-7 w-7 shrink-0",
  heroHeading: "mt-1.5 font-display leading-[1.1] tracking-tight text-ink",
  heroOrderId: "mt-2 font-mono text-body-sm text-ink-muted",
  heroSubtitle: "mt-3 max-w-lg text-body leading-relaxed text-ink-muted",
  heroActions:
    "flex shrink-0 flex-col gap-3 sm:flex-row sm:justify-center lg:justify-end",

  /* Items */
  itemsWrapper: "space-y-4",
  vendorHeaderMargin: "mb-1",
  itemsList: "divide-y divide-line",
  lineRoot:
    "grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 py-3 sm:gap-4",
  lineMediaWrapper:
    "relative size-14 shrink-0 overflow-hidden rounded-sm border border-line bg-paper sm:size-16",
  lineMediaImage: "object-cover",
  lineContent: "flex min-w-0 flex-col gap-0.5",
  lineName:
    "block break-words text-body font-medium leading-snug text-ink transition-colors",
  lineNameLink:
    "block break-words text-body font-medium leading-snug text-ink transition-colors hover:text-brand",
  lineAttrs: "font-mono text-[0.6875rem] tracking-wide text-ink-muted",
  lineQty: "mt-1 text-body-sm text-ink-muted",
  lineTotalDesktopCol: "flex shrink-0 flex-col items-end gap-1 pt-0.5",
  lineTotalDesktop:
    "text-right font-display text-[1.125rem] tabular-nums text-ink",
  lineUnitPrice: "text-right text-[0.75rem] tabular-nums text-ink-muted",
} as const;
