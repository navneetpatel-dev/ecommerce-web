export const vendorSpotlightSectionStyles = {
  loadingHeader: "mb-6 space-y-2",
  heading: "font-display text-[1.75rem] leading-tight text-ink",
  grid: "grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:gap-6",
  skeletonCard: "overflow-hidden rounded-md border border-line bg-surface",
  skeletonMedia: "aspect-[16/10] w-full rounded-none",
  skeletonBody: "space-y-3 p-4",
  headerRow: "mb-6 flex items-end justify-between gap-4",
  eyebrow: "mb-2",
  browseAllLink:
    "inline-flex shrink-0 items-center gap-1 text-body-sm text-brand hover:underline",
  card: "group block overflow-hidden rounded-md border border-line bg-surface shadow-elevation-1 transition-all duration-200 hover:border-ink/20 hover:shadow-elevation-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  mediaWrapper:
    "relative aspect-[16/10] overflow-hidden bg-[color-mix(in_srgb,var(--brand)_10%,var(--paper))]",
  imageCover:
    "object-cover transition-transform duration-300 group-hover:scale-[1.03]",
  mediaImage: "absolute inset-0",
  fallbackWrapper: "flex h-full w-full items-center justify-center",
  fallbackInitials:
    "font-display text-[2.5rem] leading-none tracking-tight text-brand",
  cardBody: "space-y-3 p-4",
  vendorName:
    "font-display text-[1.25rem] leading-tight text-ink transition-colors group-hover:text-brand",
  vendorKnownFor:
    "mt-1.5 line-clamp-2 text-body-sm leading-relaxed text-ink-muted",
} as const;
