export const vendorShopSettingsFormStyles = {
  root: "w-full min-w-0",
  stack: "space-y-8",
  header:
    "flex flex-col gap-4 border-b border-line/70 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6",
  headerLeft: "min-w-0 space-y-1.5",
  headerHeading:
    "font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl",
  headerDescription: "max-w-3xl text-body leading-relaxed text-ink-muted",
  headerBusinessName: "text-body-sm text-ink-faint",
  headerSubmitBtn: "hidden shrink-0 sm:inline-flex",

  fullWidthCol: "sm:col-span-2",
  inputCol: "sm:col-span-2 sm:max-w-md",
  categoriesScrollBox:
    "sm:col-span-2 max-h-48 space-y-2 overflow-y-auto rounded-md border border-line p-3",

  bannerRoot:
    "sm:col-span-2 overflow-hidden rounded-lg border border-line bg-paper/60 p-4 transition-colors",
  bannerRow:
    "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
  bannerLeft: "flex items-center gap-3",
  bannerIconCircle:
    "flex size-10 shrink-0 items-center justify-center rounded-full",
  bannerIconComplete:
    "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/30",
  bannerIconPending: "bg-brand-subtle text-brand ring-2 ring-brand/30",
  bannerIcon: "size-5",
  bannerHeading: "text-body font-semibold tracking-tight text-ink",
  bannerSubtitle: "text-body-sm text-ink-muted",
  bannerRight: "flex items-center gap-3 self-end sm:self-auto",
  bannerPercent: "text-body-sm font-semibold text-ink",
  bannerFraction: "text-body-sm text-ink-faint",
  progressBar: "mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-line/60",
  progressIndicator:
    "h-full rounded-full bg-brand transition-all duration-500 ease-out",

  alertBox:
    "sm:col-span-2 flex items-center gap-2 rounded-md border border-danger/30 bg-danger-subtle/50 px-3.5 py-2.5 text-body-sm text-danger",
  alertIcon: "size-4 shrink-0",
  emptyText: "sm:col-span-2 text-body-sm text-ink-muted",
  checklistStack: "sm:col-span-2 space-y-2.5",
  checklistSubtitle: "text-body-sm font-medium text-ink-muted",
  checklistGrid: "grid gap-2.5 sm:grid-cols-1",
  overrideNote: "sm:col-span-2 text-body-sm text-ink-muted",

  headerButton:
    "flex flex-col gap-2.5 p-3.5 sm:p-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset",
  headerRow:
    "flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3",
  headerLeftCol:
    "flex min-w-0 items-center justify-between gap-3 sm:justify-start",
  headerGroup: "flex min-w-0 items-center gap-3",
  titleGroup: "flex min-w-0 items-center gap-2",
  docTitle:
    "text-body font-semibold text-ink group-hover:text-brand transition-colors",
  reqDot: "size-1.5 shrink-0 rounded-full bg-brand",
  chevronMobile:
    "flex sm:hidden size-7 shrink-0 items-center justify-center rounded-md text-ink-muted group-hover:text-ink",
  chevronDesktop:
    "hidden sm:flex size-7 shrink-0 items-center justify-center rounded-md text-ink-muted group-hover:text-ink",
  chevronIcon: "size-4 transition-transform duration-300 ease-out",
  chevronIconExpanded: "rotate-180 text-brand",
  itemRoot: "group overflow-hidden rounded-lg border transition-all",
  itemExpanded:
    "border-brand/80 bg-brand-subtle/15 shadow-xs ring-1 ring-brand/40",
  itemCollapsed:
    "border-line bg-surface hover:border-line-strong hover:bg-surface-raised",
  drawer: "grid transition-all duration-300 ease-out",
  drawerExpanded:
    "grid-rows-[1fr] opacity-100 border-t border-line/60 bg-surface/90",
  drawerCollapsed: "grid-rows-[0fr] opacity-0 border-t-0 pointer-events-none",
  badgesGroup: "flex flex-wrap items-center gap-2 sm:gap-2.5 sm:shrink-0",
  remarksRow: "w-full pt-0.5",
  collapseBody: "overflow-hidden",
  collapseContent: "p-4 sm:p-5 space-y-3.5",
  uploadHeadingRow: "flex items-start gap-3 border-b border-line/70 pb-3",
  uploadIconBox:
    "flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-subtle text-brand ring-1 ring-brand/30",
  uploadIcon: "size-4.5",
  uploadTitle: "text-body font-semibold text-ink",
  uploadSubtitle: "text-body-sm text-ink-muted",
} as const;
