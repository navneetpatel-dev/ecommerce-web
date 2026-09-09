import { Check } from "lucide-react";
import { cn } from "@/shared/utils/dom/cn";
import { timelineStyles } from "../../styles/display/displayComponents.styles";

interface TimelineStep {
  label: string;
  timestamp?: string;
  status: "completed" | "current" | "upcoming";
}

interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export function Timeline({ steps, className }: TimelineProps) {
  return (
    <div className={cn(timelineStyles.container, className)}>
      {steps.map((step, i) => (
        <div key={i} className={timelineStyles.stepRow}>
          {i < steps.length - 1 && <div className={timelineStyles.connector} />}
          <div className={timelineStyles.markerWrapper}>
            {step.status === "completed" ? (
              <span className={timelineStyles.dotCompleted}>
                <Check
                  size={8}
                  className={timelineStyles.checkIcon}
                  strokeWidth={3}
                />
              </span>
            ) : step.status === "current" ? (
              <span className={timelineStyles.dotCurrent} />
            ) : (
              <span className={timelineStyles.dotUpcoming} />
            )}
          </div>
          <div className={timelineStyles.content}>
            <p
              className={cn(
                timelineStyles.label,
                step.status === "upcoming"
                  ? timelineStyles.labelUpcoming
                  : timelineStyles.labelActive,
              )}
            >
              {step.label}
            </p>
            {step.timestamp && (
              <p className={timelineStyles.timestamp}>{step.timestamp}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
