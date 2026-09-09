import { cn } from "@/shared/utils/cn";

export const CARD_MEDIA_STYLES = {
  link: "block",
  imageWrapper: (imageUnavailable: boolean) =>
    cn(
      "aspect-square rounded-md overflow-hidden bg-paper border border-line relative",
      "transition-colors duration-200",
      imageUnavailable && "group-hover:border-brand",
    ),
  image: "object-cover group-hover:scale-105 transition-transform duration-300",
  lowStockBadge:
    "absolute top-2 left-2 bg-accent-subtle text-accent text-body-sm font-semibold rounded-sm px-2 py-1",
  outOfStockOverlay:
    "absolute inset-0 bg-overlay flex items-center justify-center",
  outOfStockBadge:
    "bg-surface text-ink text-body-sm font-medium rounded-sm px-3 py-1.5",
  wishlistButton: (isWishlisted: boolean) =>
    cn(
      "absolute top-2 right-2 h-8 w-8 min-h-8 max-h-8 rounded-full bg-surface/80 backdrop-blur-xs hover:bg-surface",
      isWishlisted ? "text-danger" : "text-ink-muted",
    ),
  wishlistIcon: (isWishlisted: boolean) =>
    cn(isWishlisted && "fill-current", isWishlisted && "animate-pulse-scale"),
  quickAddOverlay: (inCart: boolean) =>
    cn(
      "absolute bottom-0 left-0 right-0 hidden p-3 md:flex",
      "transition-[opacity,transform] duration-200",
      inCart
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
    ),
} as const;
