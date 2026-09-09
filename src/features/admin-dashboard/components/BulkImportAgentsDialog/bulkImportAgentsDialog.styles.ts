import { cn } from "@/shared/utils/cn";

export const bulkImportAgentsDialogStyles = {
  triggerButton: (triggerClassName?: string) =>
    cn("gap-1.5 select-none", triggerClassName),
  triggerIcon: "size-4 text-emerald-600 dark:text-emerald-400",
  dialogContent: "max-w-2xl sm:max-w-2xl w-full",
  header: "text-left border-b border-line/60 pb-4",
  headerRow: "flex items-start gap-3.5",
  headerIconWrapper:
    "flex size-11 shrink-0 items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand shadow-xs",
  headerIcon: "size-5",
  headerTextWrapper: "space-y-1",
  title: "font-display text-xl font-semibold text-ink",
  subtitle: "text-body-sm text-ink-muted",
  body: "space-y-6 pt-2",
  schemaContainer:
    "rounded-xl border border-line/70 bg-paper/25 p-4 sm:p-5 space-y-3",
  schemaHeader: "flex flex-wrap items-center justify-between gap-2",
  schemaTitle: "text-body-sm font-semibold text-ink",
  requiredHint: "text-caption font-medium text-ink-muted",
  asterisk: "text-danger font-bold ml-1",
  asteriskPrefix: "text-danger font-bold",
  columnsWrapper: "flex flex-wrap gap-2",
  columnChip:
    "inline-flex items-center rounded-lg bg-surface px-2.5 py-1 font-mono text-caption text-ink border border-line/70 shadow-xs",
  columnChipOptional:
    "inline-flex items-center rounded-lg bg-surface px-2.5 py-1 font-mono text-caption text-ink-muted border border-line/70 shadow-xs",
  vehicleSubtext: "ml-1 text-[0.6875rem] text-ink-muted font-sans",
  schemaFooter: "text-caption text-ink-muted leading-relaxed",
  uploadStepContainer: "space-y-3",
  stepHeader: "flex items-center gap-2.5",
  stepBadge:
    "flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-caption font-bold text-brand",
  stepTitle: "text-body-sm font-semibold text-ink tracking-normal",
  errorBanner:
    "rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-body-sm font-medium text-danger",
  actionsRow:
    "flex items-center justify-end gap-3 border-t border-line/60 pt-4",
  importButton: "gap-1.5 px-4",
  importIcon: "size-3.5",

  // Template download cards
  stepContainer: "space-y-3",
  stepHeadingRow: "flex items-center gap-2.5",
  stepNumberBadge:
    "flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-caption font-bold text-brand",
  stepHeadingText: "text-body-sm font-semibold text-ink tracking-normal",
  cardsGrid: "grid grid-cols-1 sm:grid-cols-2 gap-3.5",
  excelCard:
    "flex flex-col justify-between rounded-xl border border-line bg-surface p-4 transition-all hover:border-emerald-500/50 hover:shadow-xs",
  csvCard:
    "flex flex-col justify-between rounded-xl border border-line bg-surface p-4 transition-all hover:border-brand/50 hover:shadow-xs",
  cardHeader: "flex items-center justify-between",
  excelIconWrapper:
    "flex size-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25",
  excelIcon: "size-5",
  excelBadge:
    "rounded-md bg-emerald-500/15 px-2 py-0.5 text-caption font-bold text-emerald-600 dark:text-emerald-400",
  csvIconWrapper:
    "flex size-10 items-center justify-center rounded-lg bg-paper text-ink-muted border border-line",
  csvIcon: "size-5",
  csvBadge:
    "rounded-md bg-paper px-2 py-0.5 text-caption font-semibold text-ink-muted border border-line/70",
  cardBody: "mt-3 mb-4 space-y-1",
  cardTitle: "text-body-sm font-semibold text-ink",
  cardDescription: "text-caption text-ink-muted",
  excelDownloadButton:
    "w-full gap-2 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white",
  csvDownloadButton: "w-full gap-2",
  downloadIcon: "size-3.5",

  // Import results
  resultsContainer: "space-y-5",
  resultsBannerBase: "rounded-xl border p-4 space-y-1",
  resultsBannerSuccess: "border-success/30 bg-success/10 text-success",
  resultsBannerDanger: "border-danger/30 bg-danger/10 text-danger",
  resultsBannerTitle: "text-body font-semibold",
  resultsBannerSubtitle: "text-body-sm opacity-90",
  resultsScrollBox:
    "max-h-64 space-y-2 overflow-y-auto rounded-xl border border-line bg-paper/20 p-3 text-body-sm",
  resultsRow:
    "flex items-center justify-between gap-3 rounded-lg bg-surface p-3 text-caption font-mono border border-line/50",
  resultsRowEmail: "truncate text-ink font-medium",
  resultsRowBadgeBase:
    "shrink-0 rounded-md px-2 py-0.5 font-sans font-semibold text-[0.6875rem]",
  resultsRowBadgeSuccess: "bg-success/15 text-success",
  resultsRowBadgeDanger: "bg-danger/15 text-danger",
  resultsFooter:
    "flex items-center justify-end gap-3 border-t border-line/60 pt-4",
} as const;
