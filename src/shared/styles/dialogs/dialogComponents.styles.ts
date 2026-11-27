import { OVERLAY_BACKDROP } from "../common.styles";

/** Every confirmation: icon tile beside the title, ✕ on the same line, actions bottom-right. */
export const statusDialogStyles = {
  content: "max-w-[27.5rem] rounded-2xl",
  contentWide: "max-w-2xl rounded-2xl",
  body: "gap-5 px-5 pt-5 [--dialog-pad:1.25rem] sm:gap-5 sm:px-5 sm:[--dialog-pad:1.25rem]",
  closeButton: "bg-surface-raised",
  header: "flex-row items-start gap-3.5 space-y-0 pr-9 text-left",
  iconWrap: "flex size-10 shrink-0 items-center justify-center rounded-[11px]",
  icon: "size-5",
  titleGroup: "min-w-0 flex-1 space-y-1.5 break-words",
  title:
    "text-balance pt-px text-[1.0625rem] font-semibold leading-snug tracking-normal text-ink",
  description: "text-body-sm leading-relaxed text-ink-muted",
  /** Fields line up under the title once there is room for the indent. */
  childrenWrapper: "space-y-3 min-[480px]:pl-[3.375rem]",
  childrenWrapperWide: "space-y-3",
  footer: "dialog-footer-compact",
  actionHint: "flex w-full min-[480px]:inline-flex min-[480px]:w-auto",
  variants: {
    info: {
      iconWrap: "bg-ink/[0.07] text-ink-muted",
      confirmVariant: "default",
      confirmButton: "",
    },
    success: {
      iconWrap: "bg-success-subtle text-success",
      confirmVariant: "default",
      confirmButton: "bg-success text-paper hover:bg-success/90",
    },
    warning: {
      iconWrap: "bg-warning-subtle text-warning",
      confirmVariant: "default",
      confirmButton: "bg-warning text-paper hover:bg-warning/90",
    },
    danger: {
      iconWrap: "bg-danger-subtle text-danger",
      confirmVariant: "destructive",
      confirmButton: "",
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
  closeButton: "ml-auto",
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
  stringVal: "min-w-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere]",
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
