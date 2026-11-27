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
  name: "inline-flex min-w-0 items-center gap-2 font-medium text-ink",
  nameText: "min-w-0 break-words",
  email: "break-all font-mono text-caption text-ink-muted",
  ownerIcon: "h-4 w-4 shrink-0 text-brand",
  staffIcon: "h-4 w-4 shrink-0 text-ink-muted",
  dialogError: "mb-4 rounded-md bg-destructive/10 p-3 text-xs text-destructive",
  dialogStack: "space-y-4",
} as const;
