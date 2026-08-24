"use client";

import { useMediaQuery } from "@/shared/hooks/use-media-query.hook";
import { StepIndicator } from "@/shared/components/StepIndicator.component";

const CHECKOUT_STEPS = ["Address", "Shipping", "Payment", "Review"] as const;

interface CheckoutStepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function CheckoutStepIndicator({
  currentStep,
  onStepClick,
}: CheckoutStepIndicatorProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <StepIndicator
      currentStep={currentStep}
      steps={CHECKOUT_STEPS}
      isMobile={isMobile}
      onStepClick={onStepClick}
    />
  );
}
