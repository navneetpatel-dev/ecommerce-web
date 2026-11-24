import { LABELS } from "@/shared/constants/labels";

export function PromoBannersSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label={LABELS.loading}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between animate-pulse"
        >
          <div className="flex items-center gap-4">
            <div className="h-16 w-28 rounded-lg bg-surface-muted" />
            <div className="space-y-2">
              <div className="h-4 w-48 rounded bg-surface-muted" />
              <div className="h-3 w-32 rounded bg-surface-muted" />
            </div>
          </div>
          <div className="h-8 w-24 rounded bg-surface-muted" />
        </div>
      ))}
    </div>
  );
}
