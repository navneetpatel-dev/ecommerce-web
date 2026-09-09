import { ShieldCheck } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";

interface KycProgressBannerProps {
  isComplete: boolean;
  verifiedCount: number;
  totalCount: number;
  progressPercent: number;
}

export function KycProgressBanner({
  isComplete,
  verifiedCount,
  totalCount,
  progressPercent,
}: KycProgressBannerProps) {
  return (
    <div className="sm:col-span-2 overflow-hidden rounded-lg border border-line bg-paper/60 p-4 transition-colors">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full",
              isComplete
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/30"
                : "bg-brand-subtle text-brand ring-2 ring-brand/30",
            )}
          >
            <ShieldCheck className="size-5" aria-hidden />
          </div>
          <div>
            <p className="text-body font-semibold tracking-tight text-ink">
              {isComplete
                ? LABELS.kycAllDocumentsVerified
                : LABELS.kycVerificationProgress}
            </p>
            <p className="text-body-sm text-ink-muted">
              {isComplete
                ? LABELS.kycChecklistComplete
                : LABELS.kycChecklistIncomplete}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-body-sm font-semibold text-ink">
            {LABELS.kycDocumentsVerifiedCount
              .replace("{verified}", String(verifiedCount))
              .replace("{total}", String(totalCount))}
          </span>
          <span className="text-body-sm text-ink-faint">
            ({progressPercent}%)
          </span>
        </div>
      </div>

      {totalCount > 0 && !isComplete ? (
        <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-line/60">
          <div
            className="h-full rounded-full bg-brand transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
