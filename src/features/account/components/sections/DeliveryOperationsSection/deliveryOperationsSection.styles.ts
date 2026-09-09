export const deliveryOperationsSectionStyles = {
  container: "space-y-6",
  grid: "grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.8fr)]",
  mainControlsColumn: "space-y-6",
  skeletonCard:
    "border border-line bg-surface p-6 shadow-elevation-1 space-y-4",
  skeletonTitle: "h-6 w-48",
  skeletonSubtitle: "h-4 w-72",
  skeletonAction: "mt-4 h-12 w-full",
  sectionCard: "border border-line bg-surface shadow-elevation-1",
  sectionHeader: "border-b border-line bg-paper/55 px-5 py-4 md:px-6",
  sectionTitle: "mt-1 font-display text-[1.125rem] font-medium text-ink",
  sectionSubtitle: "mt-1 text-[0.875rem] text-ink-muted",
  sectionBody: "p-5 md:p-6",
  sectionBodySpaced: "p-5 md:p-6 space-y-4",
  innerCard:
    "flex flex-col gap-4 rounded-lg border border-line bg-paper/40 p-4 sm:flex-row sm:items-center sm:justify-between",
  innerCardLeft: "flex items-start gap-3",
  iconBox:
    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded border border-line bg-surface text-brand",
  iconBoxLg:
    "flex h-10 w-10 shrink-0 items-center justify-center rounded border border-line bg-surface text-brand",
  textCol: "space-y-1",
  titleText: "block font-medium text-ink",
  bodyText: "text-body-sm text-ink-muted",
  switchCol: "flex items-center gap-3 shrink-0 self-end sm:self-center",
  errorNotice: "mt-1 text-body-sm text-danger",
  dutyRow: "flex items-center gap-2",
  dutyBadgeOn:
    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.75rem] font-medium bg-success/10 text-success border border-success/20",
  dutyBadgeOff:
    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.75rem] font-medium bg-ink-muted/10 text-ink-muted border border-line",
  dutyDotOn: "size-1.5 rounded-full bg-success",
  dutyDotOff: "size-1.5 rounded-full bg-ink-muted",
  availabilityErrorNotice: "mt-3 text-body-sm text-danger",
  fleetGrid: "grid gap-4 sm:grid-cols-2",
  fleetItem:
    "flex items-center gap-3.5 rounded-lg border border-line bg-paper/40 p-4",
  fleetLabel:
    "text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-faint",
  fleetValue: "font-medium text-ink",
  fleetFooterHint: "text-body-sm text-ink-faint",
} as const;
