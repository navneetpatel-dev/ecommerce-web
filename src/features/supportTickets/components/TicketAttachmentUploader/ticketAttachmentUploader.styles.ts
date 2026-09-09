export const ticketAttachmentUploaderStyles = {
  list: "flex flex-wrap gap-2",
  item: "relative h-20 w-20 overflow-hidden border border-line bg-paper",
  video: "h-full w-full object-cover",
  img: "object-cover",
  removeBtn:
    "absolute inset-x-0 bottom-0 bg-ink/70 px-1 py-0.5 text-[0.625rem] text-paper",

  root: "space-y-2",
  label: "text-body-sm font-medium text-ink",
  hint: "text-body-sm leading-snug text-ink-muted",
  btnRow: "flex flex-wrap items-center gap-2",
  fileInput: "sr-only",
  counterText: "text-[0.75rem] tabular-nums text-ink-muted",
  statusText: "text-body-sm text-ink-muted",
} as const;
