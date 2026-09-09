import { cn } from "@/shared/utils/cn";

export const categoryCardStyles = {
  cardLink: (hasImage: boolean, className?: string) =>
    cn(
      "group relative block aspect-[4/3] overflow-hidden rounded-md border border-line bg-paper",
      "transition-colors duration-200",
      !hasImage && "hover:border-brand",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
      "outline-none",
      className,
    ),
  image:
    "object-cover transition-transform duration-300 group-hover:scale-[1.03]",
  overlayWithImage:
    "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent",
  overlayWithoutImage:
    "pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-paper/90 to-transparent",
  labelRow:
    "absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-2 p-3 md:p-3.5",
  title: (hasImage: boolean) =>
    cn(
      "text-body font-medium leading-snug",
      hasImage ? "text-white" : "text-ink group-hover:text-brand",
    ),
  icon: (hasImage: boolean) =>
    cn(
      "h-3.5 w-3.5 shrink-0 transition-all duration-200",
      "group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
      hasImage
        ? "text-white/80 group-hover:text-white"
        : "text-ink-muted group-hover:text-brand",
    ),
  moreBadge:
    "absolute left-3 top-3 z-10 rounded-full bg-black/65 px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white shadow-sm backdrop-blur-[2px] md:left-3.5 md:top-3.5",
  moreOverlayBottom:
    "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10",
  moreOverlayTop:
    "pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/55 to-transparent",
  moreTitle: "text-body font-medium leading-snug text-white",
  moreIcon:
    "h-3.5 w-3.5 shrink-0 text-white/80 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white",
  mosaicGrid: "absolute inset-0 grid grid-cols-2 grid-rows-2 gap-px bg-line",
  mosaicCell: "relative min-h-0 min-w-0",
  mosaicImage: "object-cover",
} as const;
