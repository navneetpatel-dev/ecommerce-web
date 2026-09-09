import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { ordersComponentsStyles } from "../actions/ordersComponents.styles";

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
  return (
    <FormFieldFrame label={LABELS.trackingNumber} htmlFor="tracking-number">
      <div className={ordersComponentsStyles.formRow}>
        <Input
          id="tracking-number"
          placeholder={LABELS.trackingNumber}
          className={ordersComponentsStyles.inputFlex}
          value={trackingNumber}
          onChange={(e) => onTrackingNumberChange(e.target.value)}
        />
        <Button
          type="button"
          className={ordersComponentsStyles.buttonShrink}
          onClick={onSubmit}
        >
          {LABELS.track}
        </Button>
      </div>
    </FormFieldFrame>
  );
}
