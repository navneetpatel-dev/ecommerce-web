"use client";

import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import {
  PINCODE_LENGTH,
  PINCODE_PATTERN,
} from "@/shared/constants/geo/pincode";
import { useDeliveryLocation } from "@/shared/hooks/delivery/useDeliveryLocation.hook";
import { cn } from "@/shared/utils/dom/cn";
import { deliveryAreaStyles } from "@/shared/styles/delivery/deliveryArea.styles";

interface DeliveryPincodeChipProps {
  className?: string;
}

/**
 * The delivery area the funnel is shopped in, editable where the customer notices it.
 *
 * The pincode lives in one store (see `useDeliveryLocationStore`), so changing it here
 * changes what the cart and the address step gate on — no trip back to a product page.
 */
export function DeliveryPincodeChip({ className }: DeliveryPincodeChipProps) {
  const { pincode, state, setDeliveryLocation } = useDeliveryLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const draftIsValid = PINCODE_PATTERN.test(draft.trim());

  if (!pincode && !isEditing) return null;

  const startEditing = () => {
    setDraft(pincode ?? "");
    setIsEditing(true);
  };

  const commit = () => {
    const next = draft.trim();
    if (!PINCODE_PATTERN.test(next)) return;
    // Re-checking the same area keeps its region; a new one is region-less until an
    // address says otherwise.
    setDeliveryLocation(next, next === pincode ? state : null);
    setIsEditing(false);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraft(event.target.value.replace(/\D/g, "").slice(0, PINCODE_LENGTH));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
    }
    if (event.key === "Escape") setIsEditing(false);
  };

  return (
    <div className={cn(deliveryAreaStyles.root, className)}>
      <div className={deliveryAreaStyles.chipRow}>
        <MapPin
          aria-hidden
          className={deliveryAreaStyles.chipIcon}
          strokeWidth={1.75}
        />
        <span className={deliveryAreaStyles.chipLabel}>
          {LABELS.deliveryAreaHeading}:
        </span>
        {pincode ? (
          <span className={deliveryAreaStyles.chipPincode}>{pincode}</span>
        ) : null}
        {!isEditing ? (
          <button
            type="button"
            onClick={startEditing}
            className={deliveryAreaStyles.chipButton}
          >
            {LABELS.deliveryAreaChange}
          </button>
        ) : null}
      </div>

      {isEditing ? (
        <div className={deliveryAreaStyles.editorRow}>
          <Input
            inputMode="numeric"
            maxLength={PINCODE_LENGTH}
            value={draft}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            aria-label={LABELS.enterDeliveryPincode}
            placeholder={LABELS.enterDeliveryPincode}
            autoComplete="postal-code"
            error={draft.length > 0 && !draftIsValid}
            className={deliveryAreaStyles.editorInput}
          />
          <Button
            type="button"
            variant="outline"
            onClick={commit}
            disabled={!draftIsValid}
          >
            {LABELS.checkPincode}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsEditing(false)}
          >
            {LABELS.cancel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
