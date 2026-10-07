import type { ChangeEvent } from "react";
import { FormFieldFrame } from "@/shared/components/forms";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { ordersComponentsStyles } from "../../styles/actions/ordersComponents.styles";

interface TrackingFormProps {
  trackingNumber: string;
  onTrackingNumberChange: (value: string) => void;
  onSubmit: () => void;
}

export function TrackingForm({
  trackingNumber,
  onTrackingNumberChange,
  onSubmit,
}: TrackingFormProps) {
  const canSubmit = trackingNumber.trim().length > 0;

  const handleTrackingNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    onTrackingNumberChange(event.target.value);
  };

  return (
    <FormFieldFrame label={LABELS.trackingNumber} htmlFor="tracking-number">
      <div className={ordersComponentsStyles.formRow}>
        <Input
          id="tracking-number"
          placeholder={LABELS.trackingNumber}
          className={ordersComponentsStyles.inputFlex}
          value={trackingNumber}
          onChange={handleTrackingNumberChange}
        />
        <DisabledActionHint
          disabled={!canSubmit}
          message={LABELS.trackingNumberRequired}
        >
          <Button
            type="button"
            className={ordersComponentsStyles.buttonShrink}
            disabled={!canSubmit}
            onClick={onSubmit}
          >
            {LABELS.track}
          </Button>
        </DisabledActionHint>
      </div>
    </FormFieldFrame>
  );
}
