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
} as const;
