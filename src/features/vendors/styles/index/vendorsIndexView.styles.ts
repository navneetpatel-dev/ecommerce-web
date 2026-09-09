import { cn } from "@/shared/utils/dom/cn";

export const vendorsIndexViewStyles = {
  container: "storefront-container py-8 sm:py-10 md:py-14",
  header: "mb-8 max-w-2xl sm:mb-10",
  eyebrow: "mb-2",
  title:
    "font-display text-[2rem] font-semibold leading-tight text-ink md:text-[2.5rem]",
  subtitle: "mt-3 text-body-lg text-ink-muted",
  grid: "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3",
  skeletonCard: "rounded-lg border border-line bg-paper/40 p-4",
  skeletonRow: "flex items-start gap-3",
  skeletonAvatar: "h-12 w-12 shrink-0 rounded-lg",
  skeletonContent: "min-w-0 flex-1 space-y-2 pt-1",
  skeletonTitle: "h-4 w-32",
  skeletonSubtitle: "h-3 w-full",
  gridList: "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3",
  gridItem: "min-w-0",
  tileLink: cn(
    "group/tile flex h-full flex-col rounded-lg border border-line bg-paper/40 p-4 transition-all duration-200",
    "hover:border-brand/30 hover:bg-paper hover:shadow-elevation-1",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  ),
  tileRow: "flex items-start gap-3",
  logoWrapper:
    "relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-subtle text-brand transition-colors group-hover/tile:bg-brand group-hover/tile:text-paper",
  logoImage: "absolute inset-0",
  logoImageCover: "object-cover",
  logoFallbackText: "font-display text-body leading-none",
  tileContent: "min-w-0 flex-1",
  vendorName:
    "block truncate text-body font-semibold text-ink transition-colors group-hover/tile:text-brand",
  vendorDescription: "mt-1 line-clamp-2 text-body-sm text-ink-muted",
  visitShopRow:
    "mt-4 inline-flex items-center gap-1 text-body-sm font-medium text-brand",
  arrowIcon:
    "h-3.5 w-3.5 transition-transform group-hover/tile:translate-x-0.5",
} as const;
