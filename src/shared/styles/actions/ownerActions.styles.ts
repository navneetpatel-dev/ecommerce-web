/** Edit / Delete on the viewer's own review, question or answer — one look everywhere. */
export const ownerActionsStyles = {
  root: "flex items-center gap-1",
  action:
    "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-body-sm font-medium text-ink-muted transition-colors hover:bg-brand-subtle hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  danger: "hover:bg-danger-subtle hover:text-danger",
  icon: "h-4 w-4 shrink-0",
  /** Inside a metadata line (Q&A): same look, less height. */
  compact: "h-7 gap-1 px-2 text-[0.8125rem]",
  compactIcon: "h-3.5 w-3.5",
} as const;
