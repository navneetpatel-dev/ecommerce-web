export const reviewFormStyles = {
  // Container query root: the layout follows the form's own width (dialog vs panel).
  form: "@container w-full space-y-5",
  reviewingText: "text-body text-ink-muted",
  layout:
    "grid gap-6 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] @3xl:gap-10",
  mainColumn: "min-w-0 space-y-5",
  mediaColumn:
    "min-w-0 space-y-2 border-t border-line pt-5 @3xl:border-l @3xl:border-t-0 @3xl:pl-10 @3xl:pt-0",
  actions:
    "flex flex-col-reverse gap-2 border-t border-line pt-4 xs:flex-row xs:items-center xs:justify-end",
  submit: "w-full xs:w-auto xs:min-w-[10rem]",
  // Rating
  starsRow: "mt-1 flex flex-wrap items-center gap-x-3 gap-y-1",
  starsContainer: "flex gap-0.5",
  /** Vertical hit area is the house 44px; width stays ≥24px (WCAG 2.5.8). */
  starButton: "h-auto min-h-11 max-h-none w-auto min-w-9 px-0.5",
  starIcon: "h-7 w-7 transition-transform motion-safe:hover:scale-110",
  starActive: "fill-warning text-warning",
  starInactive: "text-line-strong",
  ratingWord: "text-body font-medium text-ink",
  ratingHint: "text-body-sm text-ink-muted",
  deleteReview:
    "w-full gap-1.5 text-danger hover:bg-danger-subtle hover:text-danger xs:mr-auto xs:w-auto",
  removeAllMedia:
    "text-body-sm font-medium text-danger underline-offset-4 hover:underline disabled:opacity-50",
} as const;
