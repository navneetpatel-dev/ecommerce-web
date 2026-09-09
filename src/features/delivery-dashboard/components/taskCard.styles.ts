export const taskCardStyles = {
  card: "flex min-h-20 items-center gap-3 rounded-md border border-line bg-surface p-4 shadow-card-hairline transition-colors hover:border-brand/40",
  icon: "size-5 shrink-0 text-brand",
  content: "min-w-0 flex-1",
  title: "truncate font-medium text-ink",
  subtitle: "mt-1 truncate text-body-sm text-ink-muted",
  chevron: "size-4 shrink-0 text-ink-muted",
} as const;
