import {
  STOREFRONT_SPLIT_LAYOUT,
  STOREFRONT_SPLIT_MAIN,
  STOREFRONT_SPLIT_ASIDE,
} from "@/shared/styles/common.styles";

export const pageSkeletonsStyles = {
  storefrontRoot: "space-y-12 md:space-y-20 pb-12",
  storefrontHero:
    "h-[min(78vh,640px)] w-full rounded-none md:h-[min(82vh,720px)]",
  storefrontContainer: "storefront-container space-y-10",
  headingStack: "space-y-3",
  headingStackPadded: "space-y-3 pt-4",

  pageRoot: "relative",
  cartContainer: "storefront-container space-y-6 py-6 md:py-8",
  cartTitleStack: "space-y-2",
  cartGrid: `items-start ${STOREFRONT_SPLIT_LAYOUT}`,
  cartMainCol: `space-y-4 ${STOREFRONT_SPLIT_MAIN}`,
  cartAsideCol: STOREFRONT_SPLIT_ASIDE.replace("hidden ", ""),
  cartLineItem: "h-28 w-full",
  cartSummary: "h-64 w-full",

  checkoutContainer: "storefront-container space-y-8 py-6 md:py-8",
  checkoutTitleStack: "space-y-2",
  checkoutProgress: "h-20 w-full",
  checkoutGrid: STOREFRONT_SPLIT_LAYOUT,
  checkoutMainCol: `space-y-4 ${STOREFRONT_SPLIT_MAIN}`,
  checkoutAsideCol: STOREFRONT_SPLIT_ASIDE.replace("hidden ", ""),
  checkoutCardLg: "mt-4 h-40 w-full",
  checkoutCardSm: "h-28 w-full",
  checkoutSummary: "h-80 w-full",

  categoriesContainer: "storefront-container space-y-10 py-10 md:py-14",
  categoriesHeader: "max-w-2xl space-y-3",

  profileContainer: "storefront-container space-y-6 py-8",
  profileGrid: "grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]",
  profileAside: "hidden h-80 w-full lg:block",
  profileMain: "h-64 w-full",

  wishlistContainer: "storefront-container space-y-6 py-10",

  contentContainer: "mx-auto max-w-[800px] space-y-4 px-4 py-12",
  contentImage: "mt-6 h-48 w-full rounded-md",

  h3w16: "h-3 w-16",
  h3w20: "h-3 w-20",
  h3w24: "h-3 w-24",
  h3w28: "h-3 w-28",
  h4w24: "h-4 w-24",
  h4w80: "h-4 w-80",
  h4wFull: "h-4 w-full",
  h4w4_5: "h-4 w-4/5",
  h4wFullMaxMd: "h-4 w-full max-w-md",
  h7w48: "h-7 w-48",
  h8w36: "h-8 w-36",
  h8w40: "h-8 w-40",
  h8w48: "h-8 w-48",
  h8w72: "h-8 w-72",
  h9w64: "h-9 w-64",
  h10w48: "h-10 w-48",
  h10w64: "h-10 w-64",
  h10w2_3: "h-10 w-2/3",
} as const;
