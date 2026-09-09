"use client";

import { ArrowRight } from "lucide-react";
import type { CartItem } from "@/shared/api/types";
import type { ShippingMethod } from "@/shared/constants/statuses";
import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
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
  const { vendors, vendorCountText, hasPincode } = useShippingStep({
    groupedByVendor,
    pincode,
  });

  return (
    <div className={SHIPPING_STEP_STYLES.root}>
      <p className={SHIPPING_STEP_STYLES.vendorCount}>{vendorCountText}</p>

      {!hasPincode && (
        <p className={SHIPPING_STEP_STYLES.pincodePrompt}>
          Select a delivery address to load shipping rates.
        </p>
      )}

      <ShippingCardsList
        vendors={vendors}
        selectedMethods={selectedMethods}
        pincode={pincode}
        onSelect={onSelect}
      />

      <DisabledActionHint
        disabled={!canContinue}
        message="Select a shipping method for each vendor to continue."
        className={SHIPPING_STEP_STYLES.actionHint}
      >
        <Button
          size="lg"
          onClick={onContinue}
          disabled={!canContinue}
          fullWidth="mobile"
          className={SHIPPING_STEP_STYLES.continueButton}
        >
          Continue to payment
          <ArrowRight size={16} />
        </Button>
      </DisabledActionHint>
    </div>
  );
}
