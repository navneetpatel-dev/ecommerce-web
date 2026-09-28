export const appliedFilterChipsStyles = {
  row: "flex flex-wrap items-center gap-2 py-1",
  /* 44px controls (Rule: control height locked at h-11) so each chip keeps a
     full tap target at every band up to lg, per design spec §3.3. */
  chip: [
    "inline-flex h-11 items-center gap-2 rounded-full border border-transparent",
    "bg-brand-subtle px-4 text-body-sm font-medium text-brand",
    "transition-colors hover:border-line hover:bg-surface",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  ].join(" "),
  chipIcon: "h-3 w-3 shrink-0",
} as const;
