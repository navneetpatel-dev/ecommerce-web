export const contactMessageFormStyles = {
  container: "space-y-4",
  grid: "grid grid-cols-1 gap-4 sm:grid-cols-2",
  fullWidth: "sm:col-span-2",
  honeypot: "absolute -left-[9999px] h-0 w-0 overflow-hidden",
  actions: "flex flex-wrap items-center justify-end gap-3",
  sentBox: "rounded-xl border border-line bg-surface p-6 text-center space-y-3",
  sentHeading: "font-display text-ink text-display-sm",
  sentBody: "text-body text-ink-muted",
  reference: "font-mono text-body font-semibold text-brand",
} as const;
