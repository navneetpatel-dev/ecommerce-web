export const vendorStorefrontPageStyles = {
  loadingContainer: "storefront-container py-10 space-y-4",
  loadingBanner: "aspect-[16/5] w-full rounded-md",
  loadingTitle: "h-10 w-64",
  loadingSubtitle: "h-5 w-96",
  loadingGrid: "mt-8 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4",
  loadingProductCard: "aspect-square rounded-sm",
  emptyContainer: "storefront-container py-20",
  pageRoot: "relative",
  bannerContainer:
    "relative aspect-[16/5] w-full overflow-hidden border-b border-line bg-paper",
  bannerMedia: "absolute inset-0",
  bannerMediaImage: "object-cover",
  bannerFallbackGlow:
    "pointer-events-none absolute inset-x-0 top-0 h-[200px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_10%,transparent),transparent_55%)]",
  contentContainer: "storefront-container relative py-8",
  header: "mb-8 flex items-center gap-4",
  logoContainer:
    "relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-line bg-surface",
  logoImage: "object-cover",
  logoFallback:
    "flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-line bg-surface",
  storeIcon: "text-ink-muted",
  shopEyebrow:
    "text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-muted",
  vendorHeading: "font-display text-[1.75rem] leading-tight text-ink",
  vendorDescription: "mt-1 max-w-prose text-body text-ink-muted",

  merchantBanner:
    "bg-brand-subtle border-b border-brand/20 px-4 py-2.5 text-body-xs sm:text-body-sm flex flex-wrap items-center justify-between gap-2 text-brand font-medium",
  merchantBannerLeft: "flex items-center gap-2",
  merchantPulseDot: "inline-block size-2 rounded-full bg-brand animate-pulse",
  merchantDashboardLink:
    "underline hover:no-underline font-semibold text-brand",
  kycBanner:
    "bg-warning-subtle border-b border-warning/20 px-4 py-2 text-body-xs sm:text-body-sm text-warning-foreground text-center font-medium",
} as const;
