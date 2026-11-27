export const seoFieldsStyles = {
  sectionContent: "gap-6",
  descriptionTextarea: "min-h-[8rem]",
  preview:
    "flex flex-col gap-2 rounded-lg border border-brand/30 bg-brand-subtle/40 p-3 sm:flex-row sm:gap-3 sm:p-5",
  previewIcon: "mt-0.5 size-5 shrink-0 text-brand",
  previewBody: "min-w-0 flex-1 space-y-3",
  previewCaption: "text-body-sm font-semibold text-ink",
  previewResult:
    "space-y-1 rounded-md border border-line bg-surface p-3 sm:p-4",
  previewUrl: "break-words text-caption text-ink-muted",
  previewTitle: "break-words text-[1.0625rem] leading-snug text-brand",
  previewDescription: "break-words text-body-sm leading-relaxed text-ink",
  previewNote: "text-caption text-ink-muted",
} as const;
