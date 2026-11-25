import { OVERLAY_BACKDROP } from "../common.styles";

export const loginRequiredDialogStyles = {
  content: "max-w-[400px]",
  header: "items-center space-y-2 text-center sm:text-center",
  iconWrap:
    "mb-1 flex h-12 w-12 items-center justify-center rounded-full border border-brand/25 bg-brand-subtle text-brand",
  icon: "h-5 w-5",
  title: "font-display text-[1.375rem] tracking-tight text-ink",
  description: "max-w-[32ch] text-body leading-relaxed text-ink-muted",
  actions: "flex flex-col gap-2.5",
  action: "h-11 w-full",
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
  backdrop: OVERLAY_BACKDROP,
  sheet:
    "absolute bottom-0 left-[env(safe-area-inset-left,0px)] right-[env(safe-area-inset-right,0px)] flex max-h-[85dvh] flex-col rounded-t-lg bg-surface shadow-elevation-4 animate-slide-in-bottom max-md:landscape:max-h-[90dvh] md:max-h-[60dvh]",
  handleWrap: "flex items-center justify-center pt-3 pb-1",
  handle: "h-1 w-10 rounded-full bg-line",
  header: "flex items-center justify-between border-b border-line px-4 py-3",
  title: "text-[1.125rem] font-semibold text-ink",
  closeButton: "ml-auto rounded-full text-ink-muted hover:text-ink",
  content: "flex-1 overflow-y-auto px-4 py-4",
} as const;

export const recordDetailDialogStyles = {
  content:
    "sm:max-w-3xl lg:max-w-4xl max-h-[90dvh] p-0 gap-0 overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl animate-in fade-in-50 zoom-in-95",
  header:
    "relative border-b border-line/70 bg-surface-subtle/30 px-5 py-4 sm:px-6 sm:py-5",
  title:
    "text-lg sm:text-xl font-bold tracking-tight text-ink pr-10 flex items-center gap-3",
  titleIconWrap:
    "flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand shrink-0 ring-1 ring-brand/20",
  badgeRow: "mt-3 flex flex-wrap items-center gap-2",
  referenceBadge:
    "inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-paper/90 px-2 py-0.5 text-[11px] font-mono font-medium text-ink",
  dateBadge: "inline-flex items-center gap-1 text-[11px] text-ink-muted",
  scrollBody:
    "overflow-y-auto max-h-[calc(90dvh-8.5rem)] px-5 py-5 sm:px-6 sm:py-6 space-y-6",
  footer:
    "border-t border-line/70 bg-surface-subtle/30 px-5 py-3 sm:px-6 sm:py-3.5 flex justify-end items-center gap-2",
  emptyText: "text-body text-ink-muted py-8 text-center",
  list: "space-y-4",
  fieldRow:
    "flex flex-col gap-1 rounded-lg border border-line/60 bg-paper/50 p-3 sm:p-3.5 transition-colors hover:border-line",
  fieldLabel:
    "text-[10px] font-semibold uppercase tracking-wider text-ink-muted/80 truncate",
  fieldValue: "min-w-0 text-body-sm font-medium text-ink break-words",
  pre: "max-h-48 overflow-auto rounded-lg border border-line bg-paper px-3 py-2 font-mono text-caption leading-relaxed text-ink whitespace-pre-wrap break-words",
  stringVal: "break-words whitespace-pre-wrap",
  numVal: "font-mono tabular-nums font-semibold",
  dash: "text-ink-faint",
} as const;

export const recordDetailImageStyles = {
  container: "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5",
  singleBannerContainer: "w-full",
  singleBannerLink: "group block w-full",
  singleBannerThumb:
    "relative aspect-[16/6] max-h-48 w-full overflow-hidden rounded-xl border border-line/60 bg-paper transition-all hover:border-brand/40",
  link: "group block shrink-0",
  thumb:
    "relative aspect-square w-full overflow-hidden rounded-xl border border-line/60 bg-paper transition-all hover:border-brand/40 hover:shadow-sm",
  image:
    "object-cover transition-transform duration-200 group-hover:scale-[1.03]",
  dash: "text-ink-faint",
} as const;
