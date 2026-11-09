export const adminGiftCardsStyles = {
  root: "w-full min-w-0 space-y-5",
  header: "space-y-1",
  heading: "font-display text-xl font-semibold text-ink",
  description: "max-w-2xl text-body-sm text-ink-muted",
  metrics: "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3",
  filters: "grid w-full gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]",
  code: "font-mono text-body-sm tracking-wide",
  person: "flex min-w-0 flex-col",
  personEmail: "truncate text-caption text-ink-muted",
} as const;
