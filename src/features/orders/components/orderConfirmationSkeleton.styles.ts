import {
  HERO_RADIAL_BG,
  STOREFRONT_PAGE_WRAPPER_COMPACT,
} from "@/shared/styles/common.styles";

export const orderConfirmationSkeletonStyles = {
  root: "relative",
  radialBg: HERO_RADIAL_BG,
  container: STOREFRONT_PAGE_WRAPPER_COMPACT,
  contentWrapper: "mx-auto max-w-6xl",
  heroRow:
    "flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10",
  heroLeft: "w-full",
  heroBadgeRow: "flex items-center justify-center gap-2 sm:justify-start",
  heroBadgeIcon: "size-7 shrink-0 rounded-full",
  heroBadgeText: "h-3 w-20",
  heroTitles: "mt-2.5 space-y-2.5",
  heroActions: "flex shrink-0 flex-col gap-3 sm:flex-row",
  heroButtonLeft: "h-11 w-full sm:w-32",
  heroButtonRight: "h-11 w-full sm:w-40",
  grid: "mt-8 grid items-start gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(19rem,1fr)] lg:gap-10",
  column: "min-w-0",
  sectionEyebrow: "h-3 w-24",
  sectionTitle: "mb-4 mt-2 h-7 w-52",
  sectionTitleAside: "mb-4 mt-2 h-7 w-40",
  itemsList: "space-y-4",
  itemCard:
    "border border-line bg-surface-raised px-4 py-3.5 shadow-elevation-1 sm:px-5",
  itemCardHeader:
    "flex items-baseline justify-between gap-3 border-b border-line pb-2",
  itemCardBody: "flex items-start gap-3 py-3 sm:gap-4",
  itemImage: "size-14 rounded-sm sm:size-16",
  itemContent: "flex-1 space-y-2 pt-0.5",
  asideCard:
    "space-y-3 border border-line bg-surface-raised p-5 shadow-elevation-1 sm:p-6",
} as const;
