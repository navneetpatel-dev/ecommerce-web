export const walletSectionSkeletonsStyles = {
  cardShell:
    "relative border border-line bg-surface-raised p-5 shadow-elevation-1 md:p-6",
  accentStripe:
    "pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand/30 via-brand/15 to-transparent",
  skeletonEyebrow: "h-3 w-24",
  skeletonTitle: "mt-3 h-10 w-44",
  skeletonSubtitle: "mt-3 h-4 w-52 max-w-full",
  balanceTwoColGrid: "mt-4 grid gap-3 sm:grid-cols-2",
  balanceColCard: "h-[4.25rem] rounded-md",
  skeletonHeading: "h-5 w-36",
  skeletonTextMd: "mt-2 h-4 w-full max-w-md",
  skeletonTextLg: "mt-2 h-3 w-full max-w-lg",
  rechargePillGrid: "mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4",
  rechargePill: "h-9 rounded-md",
  rechargeInputRow: "mt-4 space-y-2",
  skeletonLabel: "h-4 w-28",
  rechargeInputGrid:
    "grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end",
  rechargeInput: "h-10 rounded-md",
  rechargeButton: "h-10 w-full rounded-md sm:w-40",
  skeletonTerms: "mt-4 h-3 w-full max-w-xl",
  statementSection:
    "overflow-hidden rounded-md border border-line bg-surface shadow-card-hairline",
  statementHeader:
    "border-b border-line/80 bg-paper/50 px-4 py-4 sm:px-6 sm:py-5",
  skeletonStatementHeading: "h-5 w-40",
  statementGrid:
    "flex flex-col gap-5 p-4 sm:p-6 md:flex-row md:items-end md:justify-between lg:p-8",
  statementDateFields: "flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end",
  statementField: "w-full space-y-2 sm:w-44",
  skeletonFieldLabelSm: "h-4 w-12",
  skeletonFieldLabelXs: "h-4 w-8",
  statementFieldControl: "h-10 w-full rounded-md",
  statementActionsRow:
    "flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap md:shrink-0",
  statementButtonSm: "h-10 w-full rounded-md sm:w-32",
  statementButtonXs: "h-10 w-full rounded-md sm:w-28",
} as const;
