export const reviewFormStyles = {
  form: "max-w-lg",
  reviewingText: "text-body text-ink-muted",
  starsContainer: "mt-1 flex gap-1",
  /** Vertical hit area is the house 44px; width stays ≥24px (WCAG 2.5.8). */
  starButton: "h-auto min-h-11 max-h-none w-auto min-w-6 px-0",
  starIcon: "h-6 w-6",
  starActive: "fill-warning text-warning",
  starInactive: "text-line",
} as const;
