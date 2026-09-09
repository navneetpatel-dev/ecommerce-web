import {
  STOREFRONT_PAGE_WRAPPER_COMPACT,
  STOREFRONT_SPLIT_LAYOUT,
  STOREFRONT_SPLIT_MAIN,
  STOREFRONT_SPLIT_ASIDE,
} from "@/shared/styles/common.styles";

export const orderDetailSkeletonStyles = {
  root: "relative",
  radialBg:
    "pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]",
  container: STOREFRONT_PAGE_WRAPPER_COMPACT,
  headerSpace: "space-y-3",
  badgeRow: "flex flex-wrap gap-2 pt-2",
  badgePill: "h-6 rounded-full",
  layoutGrid: `mt-6 lg:mt-8 ${STOREFRONT_SPLIT_LAYOUT}`,
  mainCol: `space-y-6 ${STOREFRONT_SPLIT_MAIN}`,
  mainCard: "h-44 w-full rounded-md",
  aside: STOREFRONT_SPLIT_ASIDE,
  asideCard:
    "space-y-4 border border-line bg-surface-raised p-5 shadow-elevation-1",
  asideButton: "h-11 w-full",
  headerCrumb: "h-4 w-28",
  headerTitle: "h-9 w-56 max-w-full",
  headerMeta: "h-4 w-72 max-w-full",
  badgePill1: "h-6 w-24 rounded-full",
  badgePill2: "h-6 w-28 rounded-full",
  asideHeading: "h-4 w-32",
  asideTotal: "h-8 w-40",
  asideLine1: "h-4 w-full",
  asideLine2: "h-4 w-5/6",
  asideButtonTop: "mt-4 h-11 w-full",
} as const;
