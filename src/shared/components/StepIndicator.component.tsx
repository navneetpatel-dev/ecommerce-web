"use client";

import { Check } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";

interface StepIndicatorProps {
  currentStep: number;
  steps: readonly string[];
  isMobile: boolean;
  onStepClick: (step: number) => void;
}

const STEP_META: Record<string, { description: string }> = {
  Address: { description: "Delivery details" },
  Shipping: { description: "Arrival speed" },
  Payment: { description: "How you pay" },
  Review: { description: "Confirm & place" },
};

function stepNumber(n: number) {
  return String(n).padStart(2, "0");
}

function MobileStepDot({
  label,
  stepNum,
  currentStep,
}: {
  label: string;
  stepNum: number;
  currentStep: number;
}) {
  const done = stepNum < currentStep;
  const active = stepNum === currentStep;
  const dotClassName = cn(
    "flex h-8 w-8 items-center justify-center rounded-full text-[0.6875rem] font-semibold",
    done && "bg-brand text-paper",
    active && "border-2 border-brand bg-surface text-brand",
    !done && !active && "border border-line bg-surface text-ink-muted",
  );
  const dotContent = done ? (
    <Check size={13} strokeWidth={2.5} />
  ) : (
    stepNumber(stepNum)
  );

  return (
    <li key={label}>
      <span className={dotClassName}>{dotContent}</span>
    </li>
  );
}

function DesktopStepItem({
  label,
  stepNum,
  currentStep,
  isLast,
  onStepClick,
}: {
  label: string;
  stepNum: number;
  currentStep: number;
  isLast: boolean;
  onStepClick: (step: number) => void;
}) {
  const isCompleted = stepNum < currentStep;
  const isCurrent = stepNum === currentStep;
  const isUpcoming = stepNum > currentStep;
  const meta = STEP_META[label];
  const ariaCurrent = isCurrent ? "step" : undefined;

  const connector = !isLast && (
    <span
      aria-hidden
      className={cn(
        "absolute left-[calc(50%+1.25rem)] right-[calc(-50%+1.25rem)] top-5 h-px",
        isCompleted ? "bg-brand" : "bg-line",
      )}
    />
  );
  const buttonClassName = cn(
    "relative z-[1] h-auto min-h-0 max-h-none w-full flex-col gap-3 px-2 text-center font-normal hover:bg-transparent",
    isUpcoming && "cursor-not-allowed",
  );
  const badgeClassName = cn(
    "flex h-10 w-10 items-center justify-center rounded-full text-body-sm font-semibold transition-colors",
    isCompleted &&
      "bg-brand text-paper shadow-[0_0_0_4px_color-mix(in_srgb,var(--brand)_18%,transparent)]",
    isCurrent && "border-2 border-brand bg-surface text-brand",
    isUpcoming && "border border-line bg-surface text-ink-muted",
  );
  const badgeContent = isCompleted ? (
    <Check size={16} strokeWidth={2.5} />
  ) : (
    stepNumber(stepNum)
  );
  const labelClassName = cn(
    "block text-body font-semibold leading-snug",
    isCurrent && "text-brand",
    isCompleted && "text-ink",
    isUpcoming && "text-ink-muted",
  );

  return (
    <li
      key={label}
      className="relative flex min-w-0 flex-1 flex-col items-center"
    >
      {connector}
      <Button
        type="button"
        variant="ghost"
        onClick={() => onStepClick(stepNum)}
        disabled={isUpcoming}
        aria-current={ariaCurrent}
        className={buttonClassName}
      >
        <span className={badgeClassName}>{badgeContent}</span>

        <span className="min-w-0 max-w-[11rem]">
          <span className={labelClassName}>{label}</span>
          <span className="mt-1 block text-body-sm leading-snug text-ink-muted">
            {meta?.description}
          </span>
        </span>
      </Button>
    </li>
  );
}

export function StepIndicator({
  currentStep,
  steps,
  isMobile,
  onStepClick,
}: StepIndicatorProps) {
  const currentLabel = steps[currentStep - 1];
  const currentDescription = STEP_META[currentLabel ?? ""]?.description;
  const progressWidth = `${(currentStep / steps.length) * 100}%`;
  const mobileDots = steps.map((label, i) => (
    <MobileStepDot
      key={label}
      label={label}
      stepNum={i + 1}
      currentStep={currentStep}
    />
  ));
  const desktopItems = steps.map((label, i) => (
    <DesktopStepItem
      key={label}
      label={label}
      stepNum={i + 1}
      currentStep={currentStep}
      isLast={i === steps.length - 1}
      onStepClick={onStepClick}
    />
  ));

  if (isMobile) {
    return (
      <div className="border border-line bg-surface-raised px-5 py-5 shadow-elevation-1">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-brand">
              Step {stepNumber(currentStep)} of {stepNumber(steps.length)}
            </p>
            <p className="mt-1 font-display text-[1.25rem] leading-tight text-ink">
              {currentLabel}
            </p>
            <p className="mt-1 text-body-sm text-ink-muted">
              {currentDescription}
            </p>
          </div>
          <ol className="flex shrink-0 items-center gap-1.5" aria-hidden>
            {mobileDots}
          </ol>
        </div>
        <div aria-hidden className="mt-4 h-px bg-line">
          <div
            className="h-px bg-brand transition-[width] duration-300 ease-[cubic-bezier(0.2,0,0,1)]"
            style={{ width: progressWidth }}
          />
        </div>
      </div>
    );
  }

  return (
    <nav aria-label="Checkout progress" className="w-full">
      <ol className="relative flex w-full items-start">{desktopItems}</ol>
    </nav>
  );
}
