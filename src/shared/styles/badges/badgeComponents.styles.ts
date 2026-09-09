export const documentStatusStyles = {
  verifiedBadge:
    "inline-flex h-7.5 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap",
  pendingBadge:
    "inline-flex h-7.5 items-center gap-1.5 rounded-full border border-warning/30 bg-warning-subtle px-2.5 text-xs font-semibold text-warning whitespace-nowrap",
  rejectedBadge:
    "inline-flex h-7.5 items-center gap-1.5 rounded-full border border-danger/30 bg-danger-subtle px-2.5 text-xs font-semibold text-danger whitespace-nowrap",
  notUploadedBadge:
    "inline-flex h-7.5 items-center gap-1.5 rounded-full border border-line-strong/50 bg-line/30 px-2.5 text-xs font-medium text-ink-muted whitespace-nowrap",

  badgeIcon: "size-3.5 shrink-0",

  verifiedTile:
    "flex size-9 shrink-0 items-center justify-center rounded-lg bg-success-subtle text-success ring-1 ring-success/30",
  pendingTile:
    "flex size-9 shrink-0 items-center justify-center rounded-lg bg-warning-subtle text-warning ring-1 ring-warning/30",
  rejectedTile:
    "flex size-9 shrink-0 items-center justify-center rounded-lg bg-danger-subtle text-danger ring-1 ring-danger/30",
  notUploadedTile:
    "flex size-9 shrink-0 items-center justify-center rounded-lg bg-paper text-ink-muted ring-1 ring-line",

  tileIcon: "size-4.5",
} as const;

export const documentViewerStyles = {
  button:
    "group/viewer inline-flex h-7.5 items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 text-xs font-semibold text-ink transition-all hover:border-brand/70 hover:bg-surface-raised hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50",
  badgeTag:
    "flex size-4.5 items-center justify-center rounded-full border text-[8px] font-bold tracking-tight",
  icon: "size-2.5 shrink-0",
  labelText:
    "font-semibold text-ink group-hover/viewer:text-brand transition-colors whitespace-nowrap",
  externalIcon:
    "size-3 text-ink-muted group-hover/viewer:text-brand transition-colors shrink-0 ml-0.5",
  variants: {
    pdf: "bg-danger-subtle text-danger border-danger/30",
    docx: "bg-brand-subtle text-brand border-brand/30",
    image: "bg-accent-subtle text-accent border-accent/30",
    generic: "bg-line/40 text-ink-muted border-line-strong",
  },
} as const;
