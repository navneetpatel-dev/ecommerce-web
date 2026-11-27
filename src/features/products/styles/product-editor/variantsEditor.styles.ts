export const variantsEditorStyles = {
  stack: "space-y-3",
  card: "space-y-4 rounded-lg border border-line bg-paper/40 p-4 sm:p-5",
  cardHeader: "flex flex-wrap items-center justify-between gap-3",
  cardTitle: "min-w-0 break-words text-sm font-semibold text-ink",
  cardActions: "flex flex-wrap items-center gap-2",
  fields: "grid grid-cols-1 gap-4 sm:grid-cols-3 [&>*]:min-w-0",
  fieldWide: "sm:col-span-3",
  row: "grid grid-cols-1 gap-3 rounded-md border border-line p-3 sm:grid-cols-2 lg:grid-cols-4 [&>*]:min-w-0",
  rowActions:
    "flex flex-wrap items-center justify-end gap-2 sm:col-span-2 lg:col-span-4",
  empty: "text-sm text-ink-muted",
  actions: "flex flex-wrap gap-2",
  reasonBox: "mb-3",
  dialogContent: "max-w-5xl",
  rowReadOnlySku: "text-sm font-medium text-ink",
} as const;
