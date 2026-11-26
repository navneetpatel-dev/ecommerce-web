/** Named class groups for the image crop dialog (Rule 5). */
export const cropDialogStyles = {
  cropStage:
    "relative h-[min(52vh,24rem)] w-full overflow-hidden rounded-md border border-line bg-paper",
  controlsStack: "space-y-4",
  controlLabel:
    "text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted",
  dialogContent: "max-w-2xl sm:max-w-2xl",
  dialogFooter: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
  sliderGroup: "space-y-2",
  buttonRow: "flex flex-wrap gap-2",
} as const;
