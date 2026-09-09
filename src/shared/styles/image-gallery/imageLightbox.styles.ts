export const imageLightboxStyles = {
  titleSrOnly: "sr-only",
  modalContainer: "flex h-full min-h-0 w-full flex-col bg-paper",
  viewport: "relative h-0 min-h-0 flex-1 touch-none overflow-hidden bg-paper",
  transformLayer: "absolute inset-0 will-change-transform",
  imageWrapper: "relative h-full w-full",
  imageFit: "object-contain",
  navPrevButton:
    "absolute left-2 top-1/2 z-[2] hidden h-10 w-10 min-h-10 max-h-10 -translate-y-1/2 rounded-full border border-line bg-surface/90 shadow-elevation-1 backdrop-blur-sm sm:left-3 sm:flex sm:h-11 sm:w-11 sm:min-h-11 sm:max-h-11",
  navNextButton:
    "absolute right-2 top-1/2 z-[2] hidden h-10 w-10 min-h-10 max-h-10 -translate-y-1/2 rounded-full border border-line bg-surface/90 shadow-elevation-1 backdrop-blur-sm sm:right-3 sm:flex sm:h-11 sm:w-11 sm:min-h-11 sm:max-h-11",
  navIcon: "h-4 w-4",
  counterBadge:
    "pointer-events-none absolute bottom-3 left-1/2 z-[2] -translate-x-1/2 rounded-full bg-surface/90 px-2.5 py-1 text-[0.75rem] tabular-nums text-ink-muted backdrop-blur-sm sm:bottom-4",
  thumbnailStrip:
    "w-full min-w-0 shrink-0 border-t border-line bg-surface/95 px-3 py-2.5 backdrop-blur-sm sm:px-4 sm:py-3",
  thumbnailThumb:
    "h-12 w-12 min-h-12 max-h-none sm:h-14 sm:w-14 sm:min-h-14 sm:max-h-none",
} as const;

export const productImagePlaceholderStyles = {
  root: "absolute inset-0 flex items-center justify-center bg-brand-subtle/80 text-ink-faint",
  iconBox:
    "flex h-[28%] w-[28%] max-h-14 max-w-14 min-h-9 min-w-9 items-center justify-center opacity-80",
  svg: "h-full w-full",
} as const;
