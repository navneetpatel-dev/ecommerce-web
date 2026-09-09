export const breadcrumbStyles = {
  nav: "flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[0.75rem] leading-none text-ink-faint",
  entry: "inline-flex items-center gap-1",
  separator: "h-3 w-3 shrink-0 text-ink-faint/70",
  lastLabel: "font-medium text-ink-muted",
  link: "transition-colors hover:text-ink focus-visible:text-ink focus-visible:outline-none",
} as const;

export const paginationStyles = {
  mobileContainer: "flex items-center justify-center gap-3",
  mobileText: "text-body-sm text-ink-muted",
  desktopContainer: "flex flex-wrap items-center justify-center gap-2",
  ellipsis:
    "inline-flex h-11 min-w-11 items-center justify-center text-body-sm text-ink-muted",
  activePage: "bg-brand-subtle text-brand hover:bg-brand-subtle",
} as const;

export const scrollToTopStyles = {
  button:
    "fixed bottom-6 right-6 z-40 h-14 w-14 min-h-14 max-h-14 rounded-full shadow-elevation-2 hover:shadow-elevation-3 animate-scale-in",
  icon: "text-ink",
} as const;

export const continueShoppingStyles = {
  link: "inline-flex items-center gap-2 text-[0.875rem] font-medium leading-none text-brand transition-colors hover:text-brand-hover",
  arrowIcon: "relative top-px h-4 w-4 shrink-0",
} as const;
