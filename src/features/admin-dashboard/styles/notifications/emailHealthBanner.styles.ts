export const emailHealthBannerStyles = {
  base: "rounded-xl border border-line bg-surface px-4 py-3.5 text-body-sm space-y-2 border-l-4",
  ok: "border-l-emerald-500",
  degraded: "border-l-amber-500",
  down: "border-l-danger",
  title: "font-semibold text-ink",
  headline: "text-body-sm text-ink",
  detail: "text-caption text-ink-muted",
} as const;
