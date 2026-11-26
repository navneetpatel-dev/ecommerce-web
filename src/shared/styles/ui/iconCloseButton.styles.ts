const base =
  "inline-flex shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-full border-0 p-0 transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-50";

export const iconCloseButtonStyles = {
  /** Close for dialogs, drawers and sheets: a round, quiet target that is easy to hit. */
  dialog: `${base} size-9 text-ink-muted hover:bg-surface hover:text-ink`,
  /** Floating on top of a fullscreen surface (needs its own backing to stay visible). */
  floating: `${base} size-10 border border-line bg-surface/90 text-ink shadow-elevation-1 backdrop-blur-sm hover:bg-surface`,
  /** Remove on an image or video tile: small, in the corner, always readable. */
  overlay: `${base} absolute right-1.5 top-1.5 size-7 bg-ink/70 text-paper ring-1 ring-paper/30 backdrop-blur-sm hover:bg-danger`,
  /** Inside chips, badges, search fields and rows. */
  inline: `${base} size-6 text-ink-muted hover:bg-brand-subtle hover:text-ink`,
  iconDialog: "size-[1.125rem]",
  iconOverlay: "size-3.5",
  iconInline: "size-3.5",
} as const;
