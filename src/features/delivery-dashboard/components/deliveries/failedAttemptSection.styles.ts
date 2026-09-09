export const failedAttemptSectionStyles = {
  card: "border border-line bg-surface shadow-elevation-1",
  header:
    "flex items-center justify-between border-b border-line bg-paper/55 px-5 py-3.5",
  headerLeft: "flex items-center gap-2",
  icon: "size-4 text-warning",
  eyebrow: "!mb-0",
  badge: "text-caption font-medium uppercase tracking-wider text-warning",
  body: "space-y-4 p-5",
  description: "text-body-sm text-ink-muted leading-relaxed",
  textarea: "resize-none",
  dropzone:
    "rounded-lg border border-dashed border-line bg-paper/20 p-4 transition-colors hover:border-brand/40",
  dropzoneLabel:
    "flex cursor-pointer flex-col items-center justify-center gap-2 text-center",
  uploadIconWrapper:
    "flex size-8 items-center justify-center rounded-full border border-line bg-surface text-brand",
  uploadIcon: "size-4",
  uploadText: "text-body-sm font-medium text-ink",
  fileInput: "sr-only",
  submitButton: "w-full",
} as const;
