"use client";

import { useEffect, useRef } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { CHECKOUT_STEPS } from "../../../containers/page-view/CheckoutStepIndicator.container";
import { checkoutStepAnnouncerStyles } from "../../../styles/page-view/checkoutStepAnnouncer.styles";

interface CheckoutStepAnnouncerProps {
  /** 1-based checkout step index. */
  step: number;
}

/**
 * Announces step changes and moves focus to the top of the step panel. Without
 * this, the button that triggered the step change unmounts and keyboard users
 * are dropped back to <body> (page top) with no signal the step advanced.
 */
export function CheckoutStepAnnouncer({ step }: CheckoutStepAnnouncerProps) {
  const focusRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    focusRef.current?.focus();
  }, [step]);

  const lastIndex = CHECKOUT_STEPS.length - 1;
  const stepName = CHECKOUT_STEPS[step - 1] ?? CHECKOUT_STEPS[lastIndex];

  return (
    <>
      <div
        ref={focusRef}
        tabIndex={-1}
        className={checkoutStepAnnouncerStyles.focusTarget}
      />
      <p role="status" className={checkoutStepAnnouncerStyles.status}>
        {formatLabel(LABELS.checkoutStepAnnouncement, {
          current: String(step),
          total: String(CHECKOUT_STEPS.length),
          name: stepName,
        })}
      </p>
    </>
  );
}
