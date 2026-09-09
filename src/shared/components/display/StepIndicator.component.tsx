"use client";

import { Check } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/dom/cn";

import { stepIndicatorStyles } from "../../styles/display/stepIndicator.styles";

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
    stepIndicatorStyles.dotBase,
    done && stepIndicatorStyles.dotDone,
    active && stepIndicatorStyles.dotActive,
    !done && !active && stepIndicatorStyles.dotUpcoming,
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
        stepIndicatorStyles.connectorBase,
        isCompleted
          ? stepIndicatorStyles.connectorDone
          : stepIndicatorStyles.connectorUpcoming,
      )}
    />
  );
  const buttonClassName = cn(
    stepIndicatorStyles.button,
    isUpcoming && stepIndicatorStyles.buttonUpcoming,
  );
  const badgeClassName = cn(
    stepIndicatorStyles.badgeBase,
    isCompleted && stepIndicatorStyles.badgeCompleted,
    isCurrent && stepIndicatorStyles.badgeCurrent,
    isUpcoming && stepIndicatorStyles.badgeUpcoming,
  );
  const badgeContent = isCompleted ? (
    <Check size={16} strokeWidth={2.5} />
  ) : (
    stepNumber(stepNum)
  );
  const labelClassName = cn(
    stepIndicatorStyles.labelBase,
    isCurrent && stepIndicatorStyles.labelCurrent,
    isCompleted && stepIndicatorStyles.labelCompleted,
    isUpcoming && stepIndicatorStyles.labelUpcoming,
  );

  return (
    <li key={label} className={stepIndicatorStyles.desktopLi}>
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

        <span className={stepIndicatorStyles.textWrap}>
          <span className={labelClassName}>{label}</span>
          <span className={stepIndicatorStyles.description}>
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
      <div className={stepIndicatorStyles.mobileContainer}>
        <div className={stepIndicatorStyles.mobileHeader}>
          <div className={stepIndicatorStyles.mobileTextGroup}>
            <p className={stepIndicatorStyles.mobileStepEyebrow}>
              Step {stepNumber(currentStep)} of {stepNumber(steps.length)}
            </p>
            <p className={stepIndicatorStyles.mobileStepTitle}>
              {currentLabel}
            </p>
            <p className={stepIndicatorStyles.mobileStepDesc}>
              {currentDescription}
            </p>
          </div>
          <ol className={stepIndicatorStyles.mobileDotsList} aria-hidden>
            {mobileDots}
          </ol>
        </div>
        <div aria-hidden className={stepIndicatorStyles.progressBarTrack}>
          <div
            className={stepIndicatorStyles.progressBarFill}
            style={{ width: progressWidth }}
          />
        </div>
      </div>
    );
  }

  return (
    <nav
      aria-label="Checkout progress"
      className={stepIndicatorStyles.desktopNav}
    >
      <ol className={stepIndicatorStyles.desktopList}>{desktopItems}</ol>
    </nav>
  );
}
