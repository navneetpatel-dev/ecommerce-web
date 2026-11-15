export const vendorTeamStyles = {
  container: "space-y-6",
  header: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
  heading: "font-display text-2xl font-bold text-ink sm:text-3xl",
  description: "mt-1 text-sm text-ink-muted",
  addBtnIcon: "h-4 w-4",
  errorAlert:
    "rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive",
  loadingStack: "space-y-3",
  loadingPulseRaised: "h-12 w-full animate-pulse rounded-xl bg-surface-raised",
  loadingPulseSurface: "h-40 w-full animate-pulse rounded-xl bg-surface",
  tableWrap: "overflow-x-auto rounded-xl border border-line bg-surface",
  table: "w-full text-left text-sm text-ink",
  thead:
    "border-b border-line bg-surface-raised text-xs font-semibold uppercase text-ink-muted",
  th: "px-5 py-3.5",
  thRight: "px-5 py-3.5 text-right",
  tbody: "divide-y divide-line",
  tdName: "flex items-center gap-2 px-5 py-4 font-medium text-ink",
  tdEmail: "px-5 py-4 font-mono text-xs text-ink-muted",
  tdRole: "px-5 py-4",
  tdJoined: "px-5 py-4 text-xs text-ink-muted",
  tdActions: "px-5 py-4 text-right",
  emptyBox:
    "rounded-xl border border-dashed border-line p-8 text-center text-sm text-ink-muted",
  ownerIcon: "h-4 w-4 shrink-0 text-brand",
  staffIcon: "h-4 w-4 shrink-0 text-ink-muted",
  primaryOwnerNote: "text-xs italic text-ink-faint",
  removeBtn:
    "h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive",
  removeBtnIcon: "mr-1 h-4 w-4",
  dialogError: "mb-4 rounded-md bg-destructive/10 p-3 text-xs text-destructive",
  dialogStack: "space-y-4",
} as const;
