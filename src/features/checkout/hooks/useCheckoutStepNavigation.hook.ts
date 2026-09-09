"use client";

import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
interface UseCheckoutStepNavigationParams {
  step: 1 | 2 | 3 | 4;
  setStep: (step: 1 | 2 | 3 | 4) => void;
  canAdvance: () => boolean;
  paymentMethod: string | null;
  requireAuth: (params: {
    title: string;
    message: string;
    redirectTo: string;
  }) => boolean;
  handlePlaceOrder: (method: string) => Promise<void> | void;
}

export function useCheckoutStepNavigation({
  step,
  setStep,
  canAdvance,
  paymentMethod,
  requireAuth,
  handlePlaceOrder,
}: UseCheckoutStepNavigationParams) {
  const onStepClick = (nextStep: number) => {
    if (nextStep < step) setStep(nextStep as 1 | 2 | 3 | 4);
  };

  const onContinueToShipping = () => setStep(2);
  const onContinueToPayment = () => setStep(3);
  const onBackToShipping = () => setStep(2);
  const onBackToPayment = () => setStep(3);

  const onContinueToReview = () => {
    if (!canAdvance()) return;
    setStep(4);
  };

  const onPlaceOrder = () => {
    if (!canAdvance()) return;
    if (
      !requireAuth({
        title: LABELS.completeYourOrderTitle,
        message: LABELS.completeYourOrderMessage,
        redirectTo: PATHS.checkout,
      })
    ) {
      return;
    }
    void handlePlaceOrder(paymentMethod!);
  };

  return {
    onStepClick,
    onContinueToShipping,
    onContinueToPayment,
    onBackToShipping,
    onBackToPayment,
    onContinueToReview,
    onPlaceOrder,
  };
}
