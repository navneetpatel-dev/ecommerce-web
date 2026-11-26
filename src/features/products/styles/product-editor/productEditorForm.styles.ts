export const productEditorFormStyles = {
  form: "mb-5",
  submitError: "text-sm text-danger",

  // Media
  mediaSectionContent: "gap-6",

  // Details
  categoryOption: "flex min-w-0 flex-1 items-center gap-2.5 self-stretch",
  categoryItem: [
    "h-auto min-h-12 py-1.5",
    "h-auto min-h-10 py-0",
    "h-auto min-h-9 py-0",
    "h-auto min-h-9 py-0",
  ],
  categoryThumb:
    "relative shrink-0 overflow-hidden rounded-md border border-line bg-surface",
  categoryThumbSize: ["size-9", "size-7", "size-6", "size-6"],
  categoryName: [
    "min-w-0 truncate font-semibold text-ink",
    "min-w-0 truncate text-ink",
    "min-w-0 truncate text-ink-muted",
    "min-w-0 truncate text-ink-muted",
  ],
  /** One column of the tree guide: a vertical line, with a short elbow into the row on the last one. */
  categoryGuide:
    "relative w-5 shrink-0 self-stretch border-l border-line-strong/40",
  categoryGuideElbow:
    "after:absolute after:left-0 after:top-1/2 after:h-px after:w-3.5 after:bg-line-strong/40",
  colSpan2: "sm:col-span-2",
  selectCategoryTriggerError: "border-danger",
  descriptionTextarea: "min-h-[6.5rem]",

  // Catalog
  listStack: "space-y-2",
  highlightRow: "flex items-start gap-2",
  rowField: "min-w-0 flex-1",
  specRow:
    "grid grid-cols-1 items-start gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]",

  // Policies & SEO
  policyTextarea: "min-h-[5.5rem]",
  seoDescriptionTextarea: "min-h-[8rem]",
  seoSectionContent: "gap-6",
  seoPreview:
    "flex gap-3 rounded-lg border border-brand/30 bg-brand-subtle/40 p-4 sm:p-5",
  seoPreviewIcon: "mt-0.5 size-5 shrink-0 text-brand",
  seoPreviewBody: "min-w-0 flex-1 space-y-3",
  seoPreviewCaption: "text-body-sm font-semibold text-ink",
  seoPreviewResult: "space-y-1 rounded-md border border-line bg-surface p-4",
  seoPreviewUrl: "truncate text-caption text-ink-muted",
  seoPreviewTitle: "text-[1.0625rem] leading-snug text-brand",
  seoPreviewDescription: "text-body-sm leading-relaxed text-ink",
  seoPreviewNote: "text-caption text-ink-muted",
} as const;

export const productEditorDialogStyles = {
  dialogContent: "max-h-[min(92vh,48rem)] max-w-3xl overflow-y-auto",
  description: "text-[0.875rem] text-ink-muted",
} as const;
