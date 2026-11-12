/**
 * Fill/stroke tokens for the inline `ErrorIllustration` SVG (Rule 5). Every
 * colour is a palette token, so the artwork re-colours with light/dark themes.
 * Stroke widths and caps live on the SVG elements as attributes.
 */
export const errorIllustrationStyles = {
  root: "h-auto w-full overflow-visible",
  figure: "motion-safe:animate-float",
  disc: "fill-brand/15",
  orbit: "fill-none stroke-line",
  floorShadow:
    "fill-line/60 origin-center [transform-box:fill-box] motion-safe:animate-float-shadow",
  sparkle: "fill-brand",
  dot: "fill-brand/50",
  dotMuted: "fill-line-strong/60",
  surface: "fill-surface stroke-ink",
  band: "fill-brand/15",
  inner: "fill-line/70 stroke-ink",
  line: "fill-none stroke-ink",
  inkFill: "fill-ink",
  badge: "fill-accent stroke-paper",
  badgeMark: "fill-none stroke-surface",
  badgeDot: "fill-surface",
  brandLine: "fill-none stroke-brand",
  brandFill: "fill-brand",
  socket: "fill-surface stroke-ink-faint",
} as const;
