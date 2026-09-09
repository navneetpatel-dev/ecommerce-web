export const amountsUnavailableNoticeStyles = {
  container:
    "flex items-center justify-between gap-3 rounded-sm bg-warning-subtle px-3 py-2 text-body-sm text-warning-foreground",
  retryButton: "shrink-0 font-medium underline underline-offset-2",
} as const;

export const kycRejectionNoticeStyles = {
  container:
    "flex items-start gap-2.5 rounded-lg border border-danger/30 bg-danger-subtle p-3.5 text-xs transition-colors",
  iconWrapper:
    "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-danger/15 text-danger",
  icon: "size-3.5",
  content: "min-w-0 flex-1 space-y-0.5",
  title: "font-bold text-danger",
  reason: "font-medium text-ink leading-relaxed break-words",
  actionHint: "pt-1 text-[11px] font-semibold text-danger/90",
} as const;
