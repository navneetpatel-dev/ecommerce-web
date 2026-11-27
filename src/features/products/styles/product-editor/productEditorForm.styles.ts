import { attentionStyles } from "@/shared/styles/attention.styles";
export const productEditorFormStyles = {
  /** Draws the eye: a soft pulse, a light sweep and a blinking eye (see `.attention-pulse` in globals.css). */
  previewButton: attentionStyles.preview,
  form: "",
  submitError: "text-sm text-danger",

  // Media
  mediaSectionContent: "gap-6",

  // Details
  /** A size container: narrow dropdowns put the GST under the name instead of beside it. */
  categoryOption:
    "@container flex min-w-0 flex-1 items-center gap-2 self-stretch @[17rem]:gap-2.5",
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
    "line-clamp-2 break-words font-semibold text-ink",
    "line-clamp-2 break-words text-ink",
    "line-clamp-2 break-words text-ink-muted",
    "line-clamp-2 break-words text-ink-muted",
  ],
  categoryText:
    "flex min-w-0 flex-1 flex-col items-start gap-0.5 py-0.5 @[17rem]:flex-row @[17rem]:items-center @[17rem]:gap-2",
  categoryLabel: "flex min-w-0 max-w-full flex-col @[17rem]:flex-1",
  categoryPath: "truncate text-caption text-ink-muted",
  categoryGst:
    "shrink-0 whitespace-nowrap rounded-full bg-brand-subtle px-2 py-0.5 text-caption font-medium tabular-nums text-brand @[17rem]:ml-auto @[17rem]:px-2.5",
  /** One column of the tree guide: a vertical line, with a short elbow into the row on the last one. */
  categoryGuide:
    "relative w-3 shrink-0 self-stretch border-l border-line-strong/40 @[17rem]:w-5",
  categoryGuideElbow:
    "after:absolute after:left-0 after:top-1/2 after:h-px after:w-2 after:bg-line-strong/40 @[17rem]:after:w-3.5",
  colSpan2: "sm:col-span-2",
  detailsContent: "gap-x-6 gap-y-8",
  pricingGroup:
    "space-y-5 rounded-lg border border-line bg-paper/30 p-5 sm:col-span-2 sm:p-6",
  pricePreview:
    "space-y-2 rounded-lg border border-line bg-surface px-4 py-3.5",
  pricePreviewTitle:
    "text-caption font-semibold uppercase tracking-wide text-ink-muted",
  pricePreviewLine: "flex flex-wrap items-center gap-x-3 gap-y-1.5",
  pricePreviewPrice: "text-[1.5rem] font-semibold leading-none text-brand",
  pricePreviewMrp: "text-body-sm text-ink-muted",
  pricePreviewMeta:
    "flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-ink-muted",
  pricePreviewSavings: "font-medium text-success",
  pricePreviewNote: "text-caption text-info",
  pricingGroupHeader: "space-y-1",
  pricingGroupTitle: "text-body font-semibold text-ink",
  pricingGroupHint: "text-body-sm leading-relaxed text-info",
  pricingGrid: "grid grid-cols-1 gap-6 sm:grid-cols-2 [&>*]:min-w-0",
  selectCategoryTriggerError: "border-danger",
  descriptionTextarea: "min-h-[11rem]",

  // Catalog
  listStack: "space-y-2",
  highlightRow: "flex items-start gap-2",
  rowField: "min-w-0 flex-1",
  specRow:
    "grid grid-cols-1 items-start gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]",

  // Policies & SEO
  policyTextarea: "min-h-[5.5rem]",
} as const;

export const productEditorDialogStyles = {
  dialogContent: "max-w-4xl",
  description: "text-[0.875rem] text-ink-muted",
} as const;
