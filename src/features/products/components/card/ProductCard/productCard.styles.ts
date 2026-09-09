export const PRODUCT_CARD_STYLES = {
  root: "group relative",
  mobileControlsWrapper: "mt-2 md:hidden",
  compareHint: "mt-2",
  compareLabel: "flex items-center gap-2 text-body-sm text-ink-muted",
  controlMotionDiv: "w-full",
  controlButtonBase: "w-full",
  controlButtonOverlay:
    "rounded-full bg-surface/90 hover:bg-surface backdrop-blur-xs text-ink border border-line",
  spinner:
    "animate-spin h-4 w-4 border-2 border-ink border-t-transparent rounded-full",
} as const;
