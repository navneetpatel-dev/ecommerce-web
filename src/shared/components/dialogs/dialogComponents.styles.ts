export const loginRequiredDialogStyles = {
  content: "max-w-[400px]",
} as const;

export const statusDialogStyles = {
  content: "max-w-[420px] gap-5 sm:text-left",
  header: "space-y-4 sm:text-left",
  iconWrap:
    "mx-auto flex h-12 w-12 items-center justify-center rounded-full border sm:mx-0",
  titleGroup: "space-y-1.5",
  title: "font-display text-[1.25rem] tracking-tight text-ink",
  description: "text-body leading-relaxed text-ink-muted",
  childrenWrapper: "space-y-3",
  footer: "dialog-footer-start",
  actionHint: "flex w-full sm:inline-flex sm:w-auto",
  variants: {
    info: {
      iconWrap: "border-line bg-paper text-ink-muted",
      icon: "text-ink-muted",
    },
    success: {
      iconWrap: "border-success/25 bg-success-subtle text-success",
      icon: "text-success",
    },
    warning: {
      iconWrap: "border-warning/25 bg-warning-subtle text-warning",
      icon: "text-warning",
    },
    danger: {
      iconWrap: "border-danger/25 bg-danger-subtle text-danger",
      icon: "text-danger",
    },
  },
} as const;

export const bottomSheetViewStyles = {
  base: "fixed inset-0 z-50",
  hideMd: "md:hidden",
  hideLg: "lg:hidden",
  hideXl: "xl:hidden",
  backdrop: "absolute inset-0 bg-overlay animate-fade-in",
  sheet:
    "absolute bottom-0 left-0 right-0 flex max-h-[85vh] flex-col rounded-t-lg bg-surface shadow-elevation-4 animate-slide-in-bottom",
  handleWrap: "flex items-center justify-center pt-3 pb-1",
  handle: "h-1 w-10 rounded-full bg-line",
  header: "flex items-center justify-between border-b border-line px-4 py-3",
  title: "text-[1.125rem] font-semibold text-ink",
  closeButton: "ml-auto rounded-full text-ink-muted hover:text-ink",
  content: "flex-1 overflow-y-auto px-4 py-4",
} as const;

export const recordDetailDialogStyles = {
  content: "max-w-2xl gap-4 sm:gap-5",
  title: "pr-8",
  emptyText: "text-body text-ink-muted",
  list: "max-h-[min(60dvh,32rem)] divide-y divide-line overflow-y-auto rounded-md border border-line",
  fieldRow:
    "grid gap-1 px-4 py-3 sm:grid-cols-[minmax(7rem,11rem)_minmax(0,1fr)] sm:gap-4",
  fieldLabel:
    "text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted",
  fieldValue: "min-w-0 text-body text-ink",
  pre: "max-h-48 overflow-auto rounded-md border border-line bg-paper px-3 py-2 font-mono text-[0.75rem] leading-relaxed text-ink whitespace-pre-wrap break-words",
  stringVal: "break-words whitespace-pre-wrap",
  numVal: "font-mono tabular-nums",
  dash: "text-ink-faint",
} as const;

export const recordDetailImageStyles = {
  container: "flex flex-wrap gap-3",
  link: "group block shrink-0",
  thumb:
    "relative h-28 w-28 overflow-hidden rounded-md border border-line bg-paper transition-colors group-hover:border-brand/40 sm:h-32 sm:w-32",
  image:
    "object-cover transition-transform duration-200 group-hover:scale-[1.02]",
  dash: "text-ink-faint",
} as const;
