export const walletRechargePanelStyles = {
  container:
    "border border-line bg-surface-raised p-5 shadow-elevation-1 md:p-6",
  heading: "text-body font-semibold text-ink",
  subheading: "mt-1 text-[0.875rem] text-ink-muted",
  maxBalanceNote: "mt-2 text-[0.75rem] leading-relaxed text-ink-faint",
  presetsGrid: "mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4",
  presetButton: "h-auto min-h-9 justify-start px-3 py-2",
  presetContent: "flex flex-col items-start leading-tight",
  presetBonusHint: "text-[0.6875rem] text-ink-muted",
  customAmountWrapper: "mt-4 space-y-3",
  customAmountRow: "grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end",
  previewText: "mt-3 text-[0.875rem] text-ink-muted",
  errorText: "mt-3 text-body-sm text-danger",
  successText: "mt-3 text-body-sm text-success",
  termsNotice: "mt-4 text-[0.75rem] leading-relaxed text-ink-faint",
} as const;
