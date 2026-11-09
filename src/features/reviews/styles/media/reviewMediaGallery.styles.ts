export const reviewMediaGalleryStyles = {
  list: "mt-3 flex flex-wrap gap-2",
  thumbButton:
    "relative size-20 overflow-hidden rounded-md border border-line bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
  thumbMedia: "size-full object-cover",
  playBadge:
    "absolute inset-0 flex items-center justify-center bg-ink/30 text-paper",
  playIcon: "size-6",
  viewerContent: "max-w-3xl",
  viewerMedia: "max-h-[70dvh] w-full rounded-md bg-ink object-contain",
  viewerFrame: "relative h-[70dvh] w-full overflow-hidden rounded-md bg-ink",
  viewerImage: "object-contain",
  moderationContent: "max-h-[90dvh] max-w-3xl overflow-y-auto",
  moderationList: "space-y-3",
} as const;
