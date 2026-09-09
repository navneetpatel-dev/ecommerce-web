export const CHECKOUT_PAGE_VIEW_STYLES = {
  root: "relative",
  radialBackground:
    "pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]",
  container: "storefront-container relative py-6 md:py-8",
  layoutGrid: "grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10",
  mainCol: "min-w-0 lg:col-span-7 xl:col-span-8",
  heading: "mt-1.5 font-display text-ink leading-[1.1] tracking-tight",
  headingStyle: { fontSize: "var(--text-display-sm)" },
  stepIndicatorContainer: "mt-6 md:mt-8",
  aside: "relative hidden lg:col-span-5 lg:block xl:col-span-4",
  stickyAsideContent: "sticky top-[88px] z-10",
} as const;
