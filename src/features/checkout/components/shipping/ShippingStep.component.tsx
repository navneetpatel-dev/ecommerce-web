"use client";

import { ArrowRight } from "lucide-react";
import type { CartItem } from "@/shared/api/types";
import type { ShippingMethod } from "@/shared/constants/statuses";
import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { LABELS } from "@/shared/constants/labels";
import { useShippingStep } from "../../hooks/shipping/useShippingStep.hook";
import { ShippingCardsList } from "./ShippingCardsList.component";
import { SHIPPING_STEP_STYLES } from "../../styles/shipping/shippingStep.styles";

interface ShippingStepProps {
  groupedByVendor: Record<string, CartItem[]>;
  selectedMethods: Record<string, string>;
  pincode: string;
  canContinue: boolean;
  onSelect: (vendorId: string, method: ShippingMethod) => void;
  onContinue: () => void;
}

export function ShippingStep({
  groupedByVendor,
  selectedMethods,
  pincode,
  canContinue,
  onSelect,
  onContinue,
}: ShippingStepProps) {
  const {
    vendors,
    vendorCountText,
    hasPincode,
    isRateLookupPending,
    hasUnservableVendor,
  } = useShippingStep({
    groupedByVendor,
    selectedMethods,
    pincode,
  });

  // A vendor whose picked method has no rate for this address cannot be quoted, so the
  // review step would fail after payment. Block it here and say why.
  const canContinueWithRates = canContinue && !hasUnservableVendor;

  return (
    <div className={SHIPPING_STEP_STYLES.root}>
      <p className={SHIPPING_STEP_STYLES.vendorCount}>{vendorCountText}</p>

      {!hasPincode && (
        <p className={SHIPPING_STEP_STYLES.pincodePrompt}>
          Select a delivery address to load shipping rates.
        </p>
      )}

      {hasPincode && isRateLookupPending && (
        <p className={SHIPPING_STEP_STYLES.pincodePrompt}>
          {LABELS.checkingDeliveryOptions}
        </p>
      )}

      {hasUnservableVendor && (
        <p className={SHIPPING_STEP_STYLES.deliveryUnavailable}>
          {LABELS.noRateForSelectedMethod}
        </p>
      )}

      <ShippingCardsList
        vendors={vendors}
        selectedMethods={selectedMethods}
        pincode={pincode}
        onSelect={onSelect}
      />

      <DisabledActionHint
        disabled={!canContinueWithRates}
        message={
          hasUnservableVendor
            ? LABELS.noRateForSelectedMethodHint
            : "Select a shipping method for each vendor to continue."
        }
        className={SHIPPING_STEP_STYLES.actionHint}
      >
        <Button
          size="lg"
          onClick={onContinue}
          disabled={!canContinueWithRates}
          fullWidth="mobile"
          className={SHIPPING_STEP_STYLES.continueButton}
        >
          {LABELS.continueToPayment}
          <ArrowRight size={16} />
        </Button>
      </DisabledActionHint>
    </div>
  );
}
