"use client";

import type { ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { LABELS } from "@/shared/constants/labels";
import type { AppliedCouponSummary, EligibleCoupon } from "@/shared/api/types";
import { AppliedCouponChips } from "./AppliedCouponChips.component";
import { EligibleOffersList } from "./EligibleOffersList.component";
import { useCartCouponSection } from "./useCartCouponSection.hook";
import { cartCouponSectionStyles as styles } from "./cartCouponSection.styles";

interface CartCouponSectionProps {
  couponInput: string;
  couponMessage: string | null;
  couponError: string | null;
  couponPending: boolean;
  appliedCouponCode: string | null;
  appliedDiscount?: number;
  appliedCoupons?: AppliedCouponSummary[];
  appliedCashbackAmount?: number;
  payNowGrandTotal?: number;
  eligible: EligibleCoupon[];
  eligibleLoading?: boolean;
  onCouponInputChange: (value: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: (code?: string) => void;
  onApplyEligible: (code: string) => void;
  compact?: boolean;
}

export function CartCouponSection({
  couponInput,
  couponMessage,
  couponError,
  couponPending,
  appliedCouponCode,
  appliedDiscount = 0,
  appliedCoupons = [],
  appliedCashbackAmount = 0,
  payNowGrandTotal,
  eligible,
  eligibleLoading,
  onCouponInputChange,
  onApplyCoupon,
  onRemoveCoupon,
  onApplyEligible,
  compact,
}: CartCouponSectionProps) {
  const {
    chips,
    unusedOffers,
    offersLabel,
    applyDisabled,
    handleInputChange,
    handleInputKeyDown,
  } = useCartCouponSection({
    couponInput,
    appliedCouponCode,
    appliedDiscount,
    appliedCoupons,
    eligible,
    onCouponInputChange,
    onApplyCoupon,
  });

  let offersContent: ReactNode;
  if (eligibleLoading) {
    offersContent = <p className={styles.statusMessage}>{LABELS.loading}</p>;
  } else if (unusedOffers.length === 0) {
    offersContent = (
      <p className={styles.statusMessage}>{LABELS.noAvailableOffers}</p>
    );
  } else {
    offersContent = (
      <EligibleOffersList
        offers={unusedOffers}
        compact={compact}
        couponPending={couponPending}
        onApplyEligible={onApplyEligible}
      />
    );
  }

  const showSuccess = couponMessage && chips.length === 0;
  const showInfo = couponMessage && chips.length > 0;

  return (
    <div className={styles.root(compact)}>
      <FormFieldFrame label={LABELS.couponCodeLabel} htmlFor="cart-coupon-code">
        <div className={styles.inputRow}>
          <Input
            id="cart-coupon-code"
            placeholder={LABELS.couponCodePlaceholder}
            className={styles.input}
            value={couponInput}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
          />
          <DisabledActionHint
            disabled={applyDisabled}
            message={LABELS.enterCouponCodeToApply}
            className={styles.applyButtonWrapper}
          >
            <Button
              variant="outline"
              className={styles.applyButton}
              onClick={onApplyCoupon}
              loading={couponPending}
              disabled={applyDisabled}
            >
              {LABELS.applyCoupon}
            </Button>
          </DisabledActionHint>
        </div>
      </FormFieldFrame>

      <AppliedCouponChips
        chips={chips}
        couponPending={couponPending}
        appliedCashbackAmount={appliedCashbackAmount}
        payNowGrandTotal={payNowGrandTotal}
        onRemoveCoupon={onRemoveCoupon}
      />

      {showSuccess && <p className={styles.successMessage}>{couponMessage}</p>}
      {showInfo && <p className={styles.infoMessage}>{couponMessage}</p>}
      {couponError && <p className={styles.errorMessage}>{couponError}</p>}

      <Accordion type="single" collapsible>
        <AccordionItem value="offers" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger(compact)}>
            {offersLabel}
          </AccordionTrigger>
          <AccordionContent className={styles.accordionContent}>
            {offersContent}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
