export const bugReportDetailStyles = {
  root: "w-full min-w-0 space-y-5 sm:space-y-6",
  grid: "grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6",
  mainCol: "min-w-0 space-y-5 lg:col-span-7 xl:col-span-8",
  asideCol: "min-w-0 space-y-4 lg:col-span-5 xl:col-span-4",
  stickyAside: "space-y-4 lg:sticky lg:top-24",
  panelRootWithBar:
    "relative overflow-hidden border border-line bg-surface shadow-elevation-1",
  panelAccentBar:
    "pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand/70 via-brand/30 to-transparent",

  header: "space-y-3",
  navRow: "flex flex-wrap items-center gap-x-3 gap-y-1",
  backLink:
    "inline-flex items-center gap-1 text-body-sm text-ink-muted transition-colors hover:text-brand",
  backIcon: "h-3.5 w-3.5",
  reportNumber: "font-mono text-[0.6875rem] tabular-nums text-ink-faint",
  titleRow: "flex flex-wrap items-start justify-between gap-3",
  titleWrap: "min-w-0 flex-1",
  title:
    "font-display text-[1.25rem] font-semibold leading-tight tracking-tight text-ink sm:text-[1.5rem]",
  subtitle: "mt-1.5 text-body-sm text-ink-muted",
  badgesWrap: "flex flex-wrap items-center gap-2",

  descHeader: "border-b border-line/80 bg-paper/35 px-4 py-3.5 sm:px-5",
  descContent: "space-y-5 px-4 py-4 sm:px-5 sm:py-5",
  descText: "whitespace-pre-wrap text-body leading-relaxed text-ink",
  descSectionDivider: "border-t border-line/60 pt-4",
  descStepsText:
    "mt-2 whitespace-pre-wrap text-[0.875rem] leading-relaxed text-ink-muted",
  descInfoBox:
    "border border-line bg-paper/50 px-3 py-2.5 text-[0.875rem] text-ink-muted sm:px-4 sm:py-3",
  descInfoLabel: "font-medium text-ink",
  descLinkMono: "font-mono text-body-sm text-brand hover:underline",
  descTextMono: "font-mono text-body-sm text-ink",

  attachmentGrid: "mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4",
  attachmentItem:
    "relative aspect-square overflow-hidden rounded-md border border-line bg-paper",
  attachmentImg: "h-full w-full object-cover",
  attachmentWrap: "min-w-0",
  attachmentLabel:
    "text-[0.6875rem] uppercase tracking-[0.08em] text-ink-muted",
  attachmentValue: "mt-0.5 break-all text-body-sm text-ink",
  attachmentValueMono: "font-mono text-[0.75rem]",
} as const;
