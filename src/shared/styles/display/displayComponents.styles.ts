export const detailQuerySkeletonStyles = {
  container: "storefront-container space-y-3 py-6 md:py-8",
  hero: "h-14 w-full max-w-xl",
  body: "h-64 w-full rounded-md",
} as const;

export const emptyStateStyles = {
  container:
    "mx-auto flex flex-col items-center px-4 py-12 text-center md:py-16",
  defaultMaxWidth: "max-w-md",
  /* Token-based art frame (design spec §4.5's illustration slot): brand-subtle
     disc + tone-coloured mark, so it re-colours with the palette. */
  artWrap:
    "mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-brand-subtle text-brand",
  artIcon: "h-12 w-12",
  iconWrap:
    "mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface shadow-elevation-1",
  icon: "h-5 w-5 text-ink-muted",
  eyebrow: "text-eyebrow mb-2",
  heading:
    "font-display font-semibold tracking-tight text-ink text-h3 leading-[1.25]",
  message: "max-w-[36ch] text-body leading-[1.55] text-ink-muted",
  messageWithHeading: "mt-2",
  actions: "mt-7 flex flex-wrap items-center justify-center gap-2.5",
  button: "min-w-[9.5rem]",
} as const;

export const emptyCartStateStyles = {
  container: "relative",
  radialGlow:
    "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]",
  inner: "storefront-container relative py-16 md:py-20",
} as const;

export const statCardStyles = {
  sizes: {
    sm: "text-[1.375rem]",
    md: "text-[1.75rem]",
    lg: "text-[1.75rem]",
  },
  headerLayout: "flex-row items-center justify-between pb-2",
  titleTone: "text-body-sm font-normal text-ink-muted",
  icon: "h-4 w-4 text-ink-faint",
  skeleton: "h-10 w-32",
  value: "font-mono font-bold",
} as const;

export const ratingStarsStyles = {
  starFill: "fill-warning text-warning",
  starEmpty: "fill-none text-line",
  halfWrap: "relative",
  halfOverlay: "absolute inset-0 overflow-hidden w-1/2",
  sizeMd: "h-5 w-5",
  sizeSm: "h-3.5 w-3.5",
  count: "text-body-sm text-ink-muted",
  container: "flex items-center gap-1",
  starsRow: "flex",
  srOnly: "sr-only",
} as const;

export const successCheckmarkStyles = {
  container: "mx-auto mb-6 h-16 w-16",
  svg: "w-full h-full",
} as const;

export const truncatedTextStyles = {
  span: "block min-w-0 truncate",
  tooltipSpan: "block min-w-0 max-w-full truncate",
  tooltipContent:
    "max-w-xs whitespace-pre-wrap break-words text-left font-normal normal-case tracking-normal",
} as const;

export const timelineStyles = {
  container: "relative",
  stepRow: "flex gap-4 pb-4 relative",
  connector: "absolute left-[5px] top-3 w-[2px] h-[calc(100%+12px)] bg-line",
  markerWrapper: "relative z-10 mt-0.5",
  dotCompleted:
    "flex h-3 w-3 items-center justify-center rounded-full bg-brand",
  checkIcon: "text-paper",
  dotCurrent:
    "flex h-3 w-3 items-center justify-center rounded-full bg-brand animate-pulse-ring",
  dotUpcoming: "flex h-3 w-3 items-center justify-center rounded-full bg-line",
  content: "flex-1 min-w-0",
  label: "text-body",
  labelUpcoming: "text-ink-muted",
  labelActive: "text-ink",
  timestamp: "text-body-sm text-ink-muted mt-0.5",
} as const;

export const shareButtonStyles = {
  mobileBtn: "h-11 w-11 shrink-0 rounded-full border-line px-0 md:hidden",
  desktopBtn:
    "hidden h-11 w-11 shrink-0 rounded-full border-line px-0 md:inline-flex",
  popoverContent: "w-64",
  popoverBody: "space-y-3",
  popoverTitle: "text-body font-medium text-ink",
  copyLinkBtn: "w-full justify-start gap-2 font-normal",
  linkIcon: "h-4 w-4",
  manualCopy: "space-y-2",
  manualCopyHint: "text-body-sm text-ink-muted",
  status: "sr-only",
} as const;

export const chatWidgetStyles = {
  // Desktop only: on phones the bubble covered the first card's Quick add and
  // order thumbnails (B-61); help is in the footer and account pages there.
  container:
    "fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-6 z-40 hidden lg:block",
  panel:
    "mb-4 w-80 rounded-lg border border-line bg-surface-raised p-5 shadow-elevation-3 motion-safe:animate-scale-in",
  header: "flex items-start justify-between gap-3",
  title: "text-[1.125rem] font-semibold leading-tight text-ink",
  closeBtn: "-mr-2 -mt-1.5 h-8 w-8 shrink-0 text-ink-muted hover:text-ink",
  closeIcon: "h-4 w-4",
  message: "mt-2 text-body leading-relaxed text-ink-muted",
  actions: "mt-5 flex flex-col gap-2.5",
  primaryLink:
    "inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand px-4 text-body font-medium text-paper transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  secondaryRow: "grid grid-cols-2 gap-2.5",
  secondaryLink:
    "inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-line bg-surface px-3 text-body-sm font-medium text-ink transition-colors hover:border-line-strong hover:bg-brand-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  linkIcon: "h-4 w-4 shrink-0",
  hours: "mt-4 border-t border-line pt-3 text-body-sm text-ink-muted",
  triggerBtn:
    "h-14 w-14 min-h-14 max-h-14 rounded-full shadow-elevation-2 hover:shadow-elevation-3",
  icon: "h-6 w-6 text-ink",
} as const;

export const newsletterFormStyles = {
  form: "space-y-2",
  row: "flex items-stretch gap-2",
  input: "min-w-0 flex-1",
  submitBtn: "shrink-0",
  successMessage: "text-body-sm text-success",
} as const;

export const expandableTextStyles = {
  root: "min-w-0",
  clampByLines: {
    3: "line-clamp-3",
    4: "line-clamp-4",
    5: "line-clamp-5",
  },
  toggle:
    "mt-1 inline-flex items-center gap-1 text-body-sm font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  toggleIcon: "h-3.5 w-3.5 transition-transform",
  toggleIconOpen: "rotate-180",
} as const;

export const characterCountStyles = {
  root: "mt-1.5 flex items-center justify-between gap-3 text-[0.75rem] leading-tight",
  hint: "text-ink-muted",
  count: "ml-auto tabular-nums text-ink-muted",
  countNear: "text-warning",
  countFull: "font-medium text-danger",
} as const;
