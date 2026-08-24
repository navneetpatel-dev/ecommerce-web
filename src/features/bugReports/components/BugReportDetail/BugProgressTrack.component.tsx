import { Check } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import { cn } from "@/shared/utils/cn";
import type { ProgressStep } from "./bugReportDetailShared";

export function ProgressTrack({ steps }: { steps: ProgressStep[] }) {
  return (
    <ol className="relative space-y-0">
      {steps.map((step, index) => (
        <li key={step.label} className="relative flex gap-3 pb-4 last:pb-0">
          {index < steps.length - 1 ? (
            <span
              aria-hidden
              className={cn(
                "absolute left-[0.6875rem] top-7 h-[calc(100%-0.75rem)] w-px",
                step.status === "completed" ? "bg-brand/50" : "bg-line",
              )}
            />
          ) : null}
          <span
            className={cn(
              "relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.625rem] font-semibold",
              step.status === "completed" && "border-brand bg-brand text-paper",
              step.status === "current" &&
                "border-brand bg-brand-subtle text-brand",
              step.status === "upcoming" &&
                "border-line bg-paper text-ink-muted",
            )}
          >
            {step.status === "completed" ? (
              <Check size={11} strokeWidth={3} />
            ) : (
              index + 1
            )}
          </span>
          <div className="min-w-0 pt-0.5">
            <p
              className={cn(
                "text-[0.875rem] sm:text-body",
                step.status === "upcoming"
                  ? "text-ink-muted"
                  : "font-medium text-ink",
              )}
            >
              {step.label}
            </p>
            {step.date ? (
              <p className="mt-0.5 text-[0.75rem] text-ink-muted">
                {formatOrderDate(step.date)}
              </p>
            ) : step.status === "current" ? (
              <p className="mt-0.5 text-[0.75rem] text-brand">
                {LABELS.bugCurrentStatus}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
