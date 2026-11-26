export const fileUploadStyles = {
  root: "space-y-2",
  label: "text-body-sm font-medium text-ink",
  hint: "text-body-sm leading-snug text-ink-muted",
  buttonRow: "flex flex-wrap items-center gap-2",
  hiddenInput: "sr-only",
  previewList: "flex flex-wrap gap-2",
  pdfPreview:
    "flex h-16 min-w-[4rem] items-center justify-center border border-line bg-paper px-2 text-[0.6875rem] text-ink-muted",
  videoItem: "relative h-16 w-24 overflow-hidden border border-line bg-paper",
  videoElement: "h-full w-full object-cover",
  imageItem: "relative h-16 w-16 overflow-hidden border border-line bg-paper",
  imageElement: "object-cover",
} as const;

export const filePickerStyles = {
  root: "space-y-2",
  label: "text-body-sm font-medium text-ink block",
  hiddenInput: "sr-only",
  errorText: "flex items-center gap-1.5 text-body-sm text-danger",
  errorIcon: "size-3.5 shrink-0",
} as const;

export const filePickerDropzoneStyles = {
  dropzoneBase:
    "relative flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-7 text-center transition-all cursor-pointer select-none",
  dropzoneActive: "border-brand bg-brand/10 shadow-xs",
  dropzoneIdle:
    "border-line-strong/70 bg-paper/20 hover:border-brand/60 hover:bg-brand-subtle/40",
  dropzoneDisabled:
    "cursor-not-allowed opacity-50 hover:border-line hover:bg-paper/20",
  iconWrapper:
    "flex size-11 items-center justify-center rounded-xl border border-line/80 bg-surface shadow-xs",
  icon: "size-5 text-brand",
  textGroup: "space-y-1",
  primaryText: "text-body-sm text-ink",
  actionText:
    "font-semibold text-brand underline underline-offset-4 decoration-brand/40 hover:decoration-brand",
  hintText: "text-caption text-ink-muted",
} as const;

export const filePickerSelectedFileStyles = {
  card: "flex items-center justify-between gap-4 rounded-xl border border-line bg-surface p-3.5 shadow-elevation-1 transition-colors",
  infoGroup: "flex items-center gap-3.5 min-w-0",
  iconWrapper:
    "flex size-10 shrink-0 items-center justify-center rounded-lg border border-line/70 bg-paper/60",
  icon: "size-5 text-brand",
  textGroup: "min-w-0",
  filename: "truncate text-body-sm font-semibold text-ink",
  filesize: "text-caption text-ink-muted",
} as const;

/** The roomy `variant="card"` uploader (product images, video, size chart). */
export const fileUploadCardStyles = {
  root: "space-y-4 rounded-lg border border-dashed border-line-strong/70 bg-paper/30 p-5",
  header: "flex flex-wrap items-start justify-between gap-3",
  headerText: "min-w-0 space-y-1",
  label: "text-body font-semibold text-ink",
  hint: "text-body-sm leading-relaxed text-ink-muted",
  counter: "text-body-sm font-medium tabular-nums text-ink-muted",
  counterFull: "text-body-sm font-medium tabular-nums text-warning",
  buttonRow: "flex flex-wrap items-center gap-3",
  grid: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
  tile: "group relative aspect-square overflow-hidden rounded-md border border-line bg-surface",
  tileImage: "object-cover",
  tileVideo:
    "relative aspect-video overflow-hidden rounded-md border border-line bg-surface sm:col-span-2",
  tilePdf:
    "flex aspect-square items-center justify-center rounded-md border border-line bg-surface text-body-sm text-ink-muted",
  mainBadge:
    "absolute left-2 top-2 rounded-sm bg-brand px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-paper",
  removeButton: "absolute right-2 top-2",
} as const;
