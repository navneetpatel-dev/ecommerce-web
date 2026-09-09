export const ORDER_DETAIL_CONTENT_STYLES = {
  root: "relative",
  radialBackground:
    "pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]",
  container: "storefront-container relative py-6 md:py-8",
  bannerWrapper: "mt-4",
  layoutGrid: "mt-6 grid grid-cols-1 gap-8 lg:mt-8 lg:grid-cols-12 lg:gap-10",
  mainCol: "lg:col-span-7 xl:col-span-8",
  subOrdersList: "space-y-4",
  continueShoppingContainer: "mt-6 border-t border-line pt-4",
  aside:
    "lg:col-span-5 xl:col-span-4 lg:sticky lg:top-[88px] lg:z-10 lg:self-start",
} as const;
