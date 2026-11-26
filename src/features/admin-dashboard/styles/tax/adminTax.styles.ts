export const adminTaxStyles = {
  dialogContent: "max-w-2xl",
  form: "flex flex-col gap-6",
  sectionContent: "gap-5 sm:gap-6",
  rateNote: "text-body-sm text-info sm:col-span-2",
  focus:
    "flex flex-wrap items-center justify-between gap-4 rounded-lg border border-brand/40 bg-brand-subtle p-4 sm:p-5",
  focusBody: "min-w-0 space-y-1",
  focusTitle: "text-body font-semibold text-ink",
  focusText: "text-body-sm text-ink-muted",
  focusActions: "flex items-center gap-2",
  fields: "grid grid-cols-1 gap-5 sm:grid-cols-2 [&>*]:min-w-0",
  warning:
    "flex items-start gap-2 rounded-md border border-warning/40 bg-warning-subtle px-3 py-2 text-body-sm text-ink sm:col-span-2",
  warningIcon: "mt-0.5 size-4 shrink-0 text-warning",
  headerActions: "flex justify-end",
  lookup: "space-y-3 rounded-lg border border-line bg-surface p-4 sm:p-5",
  lookupTitle: "text-body font-semibold text-ink",
  lookupBody: "text-body-sm text-ink-muted",
  lookupResult:
    "flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md bg-paper/40 px-3 py-2 text-body-sm text-ink",
  lookupRate: "text-[1.25rem] font-semibold text-brand",
  filterGrid: "grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-4",
} as const;
