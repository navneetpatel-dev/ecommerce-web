/** Toggle chips for list filters (stars, answered state, "with photos"). */
export const filterChipStyles = {
  group: "flex flex-wrap items-center gap-2",
  chip: "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-body-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  chipIdle:
    "border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink",
  chipActive: "border-brand bg-brand-subtle text-ink",
  chipIcon: "h-3.5 w-3.5",
} as const;

export const sortSelectStyles = {
  root: "flex items-center gap-2",
  label: "shrink-0 text-body-sm text-ink-muted",
  trigger: "h-9 w-[11.5rem] text-body-sm",
} as const;
