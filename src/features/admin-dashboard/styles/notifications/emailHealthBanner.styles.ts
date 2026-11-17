export const emailHealthBannerStyles = {
  base: "rounded-xl border px-4 py-3 text-body-sm space-y-1",
  ok: "border-line bg-surface text-ink-muted",
  degraded: "border-accent/40 bg-accent-subtle text-ink",
  down: "border-danger/40 bg-danger-subtle text-danger",
  title: "font-semibold",
  headline: "text-ink",
  detail: "text-caption opacity-90",
} as const;
