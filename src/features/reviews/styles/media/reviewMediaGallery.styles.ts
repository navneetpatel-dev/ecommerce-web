const thumbBase =
  "relative overflow-hidden rounded-md border bg-surface-muted transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";
const navBase =
  "absolute top-1/2 z-[2] h-11 w-11 min-h-11 max-h-11 -translate-y-1/2 rounded-full border border-line bg-surface/90 shadow-elevation-1 backdrop-blur-sm disabled:opacity-35";

export const reviewMediaGalleryStyles = {
  list: "mt-3 flex flex-wrap gap-2",
  thumbButton: `${thumbBase} size-20 border-line`,
  thumbMedia: "size-full object-cover",
  playBadge:
    "absolute inset-0 flex items-center justify-center bg-ink/30 text-paper",
  playIcon: "size-6",
  viewerContent: "max-w-3xl",
  viewerHeader:
    "flex-row items-center justify-between gap-3 space-y-0 pr-10 text-left sm:text-left",
  viewerTitle: "min-w-0 text-[1.0625rem] sm:text-[1.125rem]",
  counter:
    "shrink-0 rounded-full border border-line bg-surface px-2.5 py-0.5 text-body-sm tabular-nums text-ink-muted",
  // Swipe sideways on touch; vertical scrolling stays with the page.
  stage: "relative touch-pan-y select-none",
  viewerMedia:
    "max-h-[65dvh] w-full rounded-md border border-line bg-paper object-contain",
  viewerFrame:
    "relative h-[55dvh] w-full overflow-hidden rounded-md border border-line bg-paper sm:h-[65dvh]",
  viewerImage: "object-contain",
  navPrev: `${navBase} left-2 sm:left-3`,
  navNext: `${navBase} right-2 sm:right-3`,
  navIcon: "h-5 w-5",
  // The viewer's strip: one row, scrolls sideways when a review has many items.
  strip: "flex gap-2 overflow-x-auto pb-1",
  stripThumb: `${thumbBase} size-14 shrink-0 border-line opacity-70 hover:opacity-100`,
  stripThumbSelected: `${thumbBase} size-14 shrink-0 border-brand ring-2 ring-brand`,
  moderationContent: "max-h-[90dvh] max-w-3xl overflow-y-auto",
  moderationList: "space-y-3",
} as const;
