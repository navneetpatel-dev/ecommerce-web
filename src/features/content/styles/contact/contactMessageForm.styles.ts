export const contactMessageFormStyles = {
  container: "space-y-6",
  header: "border-b border-line pb-4",
  title: "font-display text-[1.35rem] leading-tight text-ink",
  hint: "mt-1 text-body-sm text-ink-muted",
  grid: "grid grid-cols-1 gap-4 sm:grid-cols-2",
  fullWidth: "sm:col-span-2",
  messageFooter: "mt-1.5 flex items-center justify-between gap-2",
  charCount: "ml-auto text-caption tabular-nums text-ink-muted",
  honeypot: "absolute -left-[9999px] h-0 w-0 overflow-hidden",
  actions:
    "flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5",
  slaNote: "text-caption text-ink-muted",
  sentBox:
    "border border-line bg-surface-raised p-8 text-center shadow-elevation-1 space-y-4",
  sentIconBox:
    "mx-auto flex h-12 w-12 items-center justify-center border border-line bg-paper text-brand",
  sentHeading: "font-display text-display-sm text-ink",
  sentBody: "mx-auto max-w-md text-body text-ink-muted",
  referencePill:
    "inline-block border border-line bg-paper px-4 py-2 font-mono text-body font-semibold tracking-wider text-brand",
  sentActions: "pt-2",
} as const;
