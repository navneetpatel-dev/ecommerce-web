export const adminCategoryAttributesActionStyles = {
  dialogContent: "max-h-[min(92vh,48rem)] max-w-lg overflow-y-auto",
  dialogDescription: "text-[0.875rem] text-ink-muted",
  listContainer:
    "max-h-48 space-y-2 overflow-y-auto rounded-md border border-line p-3",
  emptyRow: "text-[0.875rem] text-ink-muted",
  formSection: "mt-4",
  errorMessage: "text-body-sm text-danger",
  rowContainer: "flex items-center justify-between gap-2 text-[0.875rem]",
  rowLeft: "flex min-w-0 flex-1 items-center gap-2",
  dragHandle:
    "h-auto min-h-0 max-h-none w-auto cursor-grab touch-none px-0 text-ink-faint hover:bg-transparent hover:text-ink active:cursor-grabbing",
  iconSize: "h-4 w-4",
  rowLabel: "truncate",
  rowType: "text-ink-muted",
  rowActions: "flex shrink-0 items-center gap-1",
  btnDanger: "text-danger",
} as const;
