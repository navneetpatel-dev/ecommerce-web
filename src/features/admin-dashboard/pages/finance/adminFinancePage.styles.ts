export const adminFinancePageStyles = {
  payoutsStack: "space-y-4",
  payoutsActionRow: "flex justify-end",
  reportsTabs: "space-y-6",
  reportsHeaderRow: "flex flex-wrap items-center justify-between gap-3",
  reportsTabsList:
    "h-auto flex-wrap justify-start gap-1 rounded-lg border border-line bg-paper/60 p-1",
  reportsTabTrigger:
    "gap-2 rounded-md border-b-0 px-3.5 py-2 text-body-sm text-ink-muted hover:text-ink data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-elevation-1",
  tabIcon: "size-4",
  reportsAllContent: "mt-0 space-y-6",
  reportsSingleContent: "mt-0",
  overviewGrid: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
  overviewCard:
    "flex flex-col justify-between rounded-lg border border-line bg-surface p-5 shadow-elevation-1 transition hover:border-line-strong hover:shadow-elevation-2",
  overviewCardHeader: "space-y-2",
  overviewCardIconWrapper:
    "flex size-9 items-center justify-center rounded-md border border-line bg-paper text-ink",
  overviewCardTitle: "text-body-base font-semibold text-ink",
  overviewCardDescription: "text-body-sm text-ink-muted",
  overviewCardFooter: "mt-4 pt-3 border-t border-line/60 flex justify-end",
} as const;
