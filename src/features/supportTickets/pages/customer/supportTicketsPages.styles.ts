export const supportTicketsPagesStyles = {
  skeletonFallback: "h-40 w-full",
  vendorPageStack: "w-full min-w-0 space-y-8",
  adminPageStack: "w-full min-w-0 space-y-5",
  vendorTitleStack: "min-w-0 space-y-1.5",
  adminTitleStack: "min-w-0 space-y-1",
  titleHeading:
    "font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl",
  vendorTitleDescription: "max-w-3xl text-body leading-relaxed text-ink-muted",
  adminTitleDescription: "text-body-sm text-ink-muted",
  customerPageContainer: "storefront-container py-8 md:py-10",
  customerHeaderRow: "mb-8 flex flex-wrap items-end justify-between gap-4",
  customerHeaderInfo: "min-w-0 max-w-2xl space-y-1",
  customerHeaderSubtitle: "text-body text-ink-muted",
  customerCreateButton: "shrink-0",
  customerFiltersMargin: "mb-5",
  customerNewTicketContainer: "storefront-container py-8 md:py-10",
  errorBox: "border border-line bg-surface-raised px-5 py-10 text-center",
  detailSkeletonMargin: "space-y-3 py-4",
  customerDetailErrorContainer: "storefront-container py-8",
  customerDetailRoot: "relative",
  customerDetailGlow:
    "pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_10%,transparent),transparent_60%)]",
  customerDetailContainer:
    "storefront-container relative py-6 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:py-8 lg:pb-10",
} as const;
