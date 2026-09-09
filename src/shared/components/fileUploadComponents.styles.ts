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
    "border-line-strong/70 bg-paper/20 hover:border-brand/60 hover:bg-paper/40",
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
  removeButton:
    "flex size-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-paper hover:text-ink disabled:opacity-50",
  removeIcon: "size-4",
} as const;
