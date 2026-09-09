export const deliveryDispatchPanelStyles = {
  root: "rounded-lg border border-line bg-surface p-5 md:p-6 shadow-elevation-1 space-y-6",
  header:
    "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line/60 pb-4",
  titleRow: "flex items-center gap-2",
  truckIcon: "size-5 text-brand",
  title: "font-display text-[1.125rem] font-semibold text-ink",
  subtitle: "mt-1 text-body-sm text-ink-muted",
  targetAgentWrapper: "w-full sm:w-72 shrink-0",
  agentLabel: "text-caption font-medium text-ink-muted block mb-1",
  grid: "grid gap-5 md:grid-cols-2",
  successAlert:
    "rounded-md border border-success/30 bg-success/10 px-3.5 py-2.5 text-body-sm font-medium text-success",
  errorAlert:
    "rounded-md border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-body-sm font-medium text-danger",
  selectTrigger: "w-full",
} as const;
