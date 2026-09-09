import { Check } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import { cn } from "@/shared/utils/dom/cn";
import type { ProgressStep } from "../../../utils/detail/bugReportDetailShared";
import { bugReportPanelsStyles } from "../../../styles/detail/bugReportPanels.styles";

export function ProgressTrack({ steps }: { steps: ProgressStep[] }) {
  return (
    <ol className={bugReportPanelsStyles.trackList}>
      {steps.map((step, index) => (
        <li key={step.label} className={bugReportPanelsStyles.trackItem}>
          {index < steps.length - 1 ? (
            <span
              aria-hidden
              className={cn(
                bugReportPanelsStyles.trackLine,
                step.status === "completed"
                  ? bugReportPanelsStyles.trackLineCompleted
                  : bugReportPanelsStyles.trackLineIncomplete,
              )}
            />
          ) : null}
          <span
            className={cn(
              bugReportPanelsStyles.trackIcon,
              step.status === "completed" &&
                bugReportPanelsStyles.trackIconCompleted,
              step.status === "current" &&
                bugReportPanelsStyles.trackIconCurrent,
              step.status === "upcoming" &&
                bugReportPanelsStyles.trackIconUpcoming,
            )}
          >
            {step.status === "completed" ? (
              <Check size={11} strokeWidth={3} />
            ) : (
              index + 1
            )}
          </span>
          <div className={bugReportPanelsStyles.trackContent}>
            <p
              className={cn(
                bugReportPanelsStyles.trackLabel,
                step.status === "upcoming"
                  ? bugReportPanelsStyles.trackLabelUpcoming
                  : bugReportPanelsStyles.trackLabelActive,
              )}
            >
              {step.label}
            </p>
            {step.date ? (
              <p className={bugReportPanelsStyles.trackDesc}>
                {formatOrderDate(step.date)}
              </p>
            ) : step.status === "current" ? (
              <p className={bugReportPanelsStyles.trackDescActive}>
                {LABELS.bugCurrentStatus}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
