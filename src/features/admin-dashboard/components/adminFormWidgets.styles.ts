export const adminFormWidgetsStyles = {
  // Common / Shared
  colSpan2: "sm:col-span-2",
  gridSm2: "grid gap-4 sm:grid-cols-2",
  iconSm: "size-4",
  iconSmShrink0: "size-4 shrink-0",
  iconMd: "size-5",

  // BroadcastNotificationForm
  broadcastCard:
    "space-y-4 rounded-md border border-line-strong bg-surface-raised p-4",
  broadcastTitle: "text-body font-medium text-ink",
  broadcastHint: "mt-1 text-body-sm text-ink-muted",
  errorSm: "text-body-sm text-danger",
  successSm: "text-body-sm text-success",

  // AdminWalletAdjustPanel
  walletPanelRoot:
    "rounded-lg border border-line bg-surface p-5 md:p-6 shadow-elevation-1 space-y-6",
  walletHeader:
    "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4",
  walletHeaderLeft: "flex items-center gap-3",
  walletIconBadge:
    "flex size-10 items-center justify-center rounded-lg border border-brand/20 bg-brand/10 text-brand shadow-elevation-1",
  walletTitle: "font-display text-[1.125rem] font-semibold text-ink",
  walletSubtitle: "text-body-sm text-ink-muted",
  walletFormContainer:
    "space-y-5 rounded-lg border border-line bg-paper/40 p-4 md:p-5",
  walletActionRow: "flex flex-wrap items-center gap-3 pt-1",
  walletErrorAlert:
    "flex items-center gap-2.5 rounded-lg border border-danger/20 bg-danger/10 p-3 text-body-sm text-danger",
  walletSuccessAlert:
    "flex items-center gap-2.5 rounded-lg border border-success/20 bg-success/10 p-3 text-body-sm text-success",
} as const;
