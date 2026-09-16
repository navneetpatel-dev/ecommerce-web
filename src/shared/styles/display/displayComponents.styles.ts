export const detailQuerySkeletonStyles = {
  container: "storefront-container space-y-3 py-6 md:py-8",
  hero: "h-14 w-full max-w-xl",
  body: "h-64 w-full rounded-md",
} as const;

export const emptyStateStyles = {
  container:
    "mx-auto flex flex-col items-center px-4 py-12 text-center md:py-16",
  defaultMaxWidth: "max-w-md",
  iconWrap:
    "mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface shadow-elevation-1",
  icon: "h-5 w-5 text-ink-muted",
  eyebrow: "text-eyebrow mb-2",
  heading: "font-display font-semibold tracking-tight text-ink",
  message: "max-w-[36ch] text-ink-muted",
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
} as const;

export const chatWidgetStyles = {
  container: "fixed bottom-20 left-6 z-40 lg:bottom-6",
  panel:
    "mb-4 w-80 rounded-lg border border-line bg-surface-raised p-4 shadow-elevation-3",
  title: "text-[1.125rem] font-semibold text-ink",
  message: "mt-2 text-body text-ink-muted",
  closeBtn:
    "mt-4 h-auto min-h-0 max-h-none px-0 py-0 text-body-sm font-medium text-brand",
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
