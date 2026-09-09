export const walletSectionSkeletonsStyles = {
  cardShell:
    "relative border border-line bg-surface-raised p-5 shadow-elevation-1 md:p-6",
  accentStripe:
    "pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand/30 via-brand/15 to-transparent",
  balanceTwoColGrid: "mt-4 grid gap-3 sm:grid-cols-2",
  balanceColCard: "h-[4.25rem] rounded-md",
  rechargePillGrid: "mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4",
  rechargePill: "h-9 rounded-md",
  rechargeInputRow: "mt-4 space-y-2",
  rechargeInputGrid:
    "grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end",
  rechargeInput: "h-10 rounded-md",
  rechargeButton: "h-10 w-full rounded-md sm:w-40",
  statementSection:
    "overflow-hidden rounded-md border border-line bg-surface shadow-card-hairline",
  statementHeader:
    "border-b border-line/80 bg-paper/50 px-4 py-4 sm:px-6 sm:py-5",
  statementGrid:
    "grid gap-5 p-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-6 sm:p-6 xl:grid-cols-3 lg:gap-x-8 lg:p-8",
  statementField: "space-y-2",
  statementFieldControl: "h-10 rounded-md",
  statementActionsRow: "flex flex-wrap gap-2 sm:col-span-2 xl:col-span-3",
  statementButtonSm: "h-10 w-full rounded-md sm:w-32",
  statementButtonXs: "h-10 w-full rounded-md sm:w-28",
} as const;
