export const ticketThreadStyles = {
  root: "w-full min-w-0 space-y-5 md:space-y-6",
  grid: "grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6",
  mainCol: "min-w-0 space-y-4 lg:col-span-8",
  aside: "min-w-0 space-y-4 lg:col-span-4",
  panelCard:
    "relative overflow-hidden border border-line bg-surface shadow-elevation-1 lg:sticky lg:top-24",
  accentBar:
    "pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand/70 via-brand/30 to-transparent",

  header: "space-y-2",
  navRow: "flex flex-wrap items-center gap-x-3 gap-y-1",
  backLink:
    "inline-flex items-center gap-1 text-body-sm text-ink-muted transition-colors hover:text-brand",
  backIcon: "h-3.5 w-3.5",
  ticketId: "font-mono text-[0.6875rem] tabular-nums text-ink-faint",
  titleWrap: "min-w-0",
  title:
    "font-display text-[1.25rem] font-semibold leading-tight tracking-tight text-ink sm:text-[1.375rem]",
  metaRow: "mt-1.5 flex flex-wrap items-center gap-1.5",
  metaText: "text-[0.75rem] text-ink-muted",

  convSection:
    "relative overflow-hidden border border-line bg-surface shadow-elevation-1",
  convBar:
    "pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand/70 via-brand/30 to-transparent",
  convHeader:
    "flex items-center justify-between gap-3 border-b border-line/80 px-3 py-2.5 sm:px-4",
  convCount: "text-[0.75rem] tabular-nums text-ink-muted",
  convBody:
    "space-y-3 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_6%,transparent),transparent_55%)] px-3 py-4 sm:px-4",
  convLoadMoreWrap: "flex justify-center",
  convSkeletonList: "space-y-3",
  convSkeletonLeft: "h-14 w-3/4 rounded-[1.15rem]",
  convSkeletonRight: "ml-auto h-14 w-2/3 rounded-[1.15rem]",
  convEmpty:
    "border border-dashed border-line bg-paper/40 px-4 py-8 text-center text-[0.875rem] text-ink-muted",
  convList: "space-y-3",
  convContainer: "max-h-[min(70vh,36rem)] overflow-y-auto overscroll-contain",
  convViewport: "relative w-full",
  convItemWrapper: "absolute left-0 top-0 w-full pb-3",

  bubbleRow: "flex gap-2.5 sm:gap-3",
  bubbleRowOwn: "flex-row-reverse",
  bubbleRowOther: "flex-row",
  bubbleAvatar: "mt-1 h-8 w-8 shrink-0 border border-line sm:h-9 sm:w-9",
  bubbleFallback: "text-[0.7rem] font-semibold sm:text-[0.75rem]",
  bubbleFallbackOwn: "bg-brand-subtle text-brand",
  bubbleFallbackOther: "bg-paper text-ink-muted",
  bubbleBodyWrap: "max-w-[min(100%,32rem)] min-w-0",
  bubbleContent: "px-3.5 py-2.5 sm:px-4 sm:py-3",
  bubbleContentOwn:
    "rounded-[1.15rem] rounded-tr-md border border-brand/30 bg-brand-subtle shadow-elevation-1",
  bubbleContentOther:
    "rounded-[1.15rem] rounded-tl-md border border-line bg-surface shadow-card-hairline-strong",
  bubbleMeta: "mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5",
  bubbleMetaOwn: "justify-end",
  bubbleMetaOther: "justify-start",
  bubbleSenderName: "text-[0.75rem] font-semibold text-ink sm:text-body-sm",
  bubbleTimestamp: "text-[0.6875rem] text-ink-muted",
  bubbleText: "whitespace-pre-wrap text-body leading-relaxed text-ink",

  thumbsList: "mt-3 flex flex-wrap gap-2",
  thumbBoxBase:
    "relative overflow-hidden rounded-md border border-line bg-paper",
  thumbBoxSm: "h-14 w-14",
  thumbBoxMd: "h-20 w-20",
  thumbImg: "h-full w-full object-cover",
  thumbObjectCover: "object-cover",

  composerBlockedBox: "border-t border-line bg-paper/40 px-3 py-3 sm:px-4",
  composerBlockedText: "text-body-sm text-ink-muted",
  composerBox: "space-y-2 border-t border-line bg-paper/30 px-3 py-3 sm:px-4",
  composerTextarea: "min-h-[4.5rem] resize-y",
  composerCounterText: "text-[0.75rem] tabular-nums text-ink-muted",
  composerActionsRow: "flex justify-end",
  composerSendIcon: "mr-1.5",

  ratingCard: "border border-line bg-surface p-3 shadow-elevation-1 sm:p-4",
  ratingHint: "mt-1 text-[0.75rem] text-ink-muted",
  ratingRow: "mt-3 flex flex-wrap items-center gap-3",
  ratingStars: "flex gap-0.5",
  starBtn:
    "rounded-sm p-0.5 transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50",
  starTransition: "transition-colors",
  starActive: "fill-brand text-brand",
  starInactive: "fill-transparent text-ink-muted/50",
  starBannerInactive: "fill-transparent text-ink-muted/40",
  ratedBanner:
    "flex items-center gap-2 border border-brand/25 bg-brand-subtle/50 px-3 py-2",
  ratedText: "text-body-sm text-ink",

  controlsSection: "space-y-3 border-t border-line/60 pt-4",
  controlsBtnRow: "flex flex-wrap gap-2",
  controlsFullSmBtn: "w-full sm:w-auto",
} as const;
