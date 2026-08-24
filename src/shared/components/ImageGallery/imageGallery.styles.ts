/** Named class groups for the product image gallery stage (Rule 5). */
export const imageGalleryStyles = {
  root: "min-w-0 md:col-span-6 lg:col-span-7 lg:sticky lg:top-[88px] lg:z-[1] lg:self-start",
  layoutRow:
    "flex min-w-0 flex-col gap-2.5 sm:gap-3 lg:flex-row lg:items-stretch lg:gap-3.5",
  thumbColumn:
    "order-2 w-full min-w-0 pb-0.5 lg:order-1 lg:w-[4.25rem] lg:shrink-0",
  thumbSquare: "h-14 w-14 min-h-14 max-h-none sm:h-16 sm:w-16 sm:min-h-16",
  thumbSquareDesktop:
    "lg:h-[4.25rem] lg:w-[4.25rem] lg:min-h-[4.25rem] lg:max-h-none",
  stageBase:
    "relative w-full cursor-zoom-in overflow-hidden rounded-2xl border border-line bg-paper select-none touch-pan-y",
  positionBadge:
    "pointer-events-none absolute left-2.5 top-2.5 z-[2] rounded-full border border-line bg-surface/90 px-2.5 py-1 text-body-sm tabular-nums text-ink-muted backdrop-blur-sm sm:left-3 sm:top-3",
} as const;
