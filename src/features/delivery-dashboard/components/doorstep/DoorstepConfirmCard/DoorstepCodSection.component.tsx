import { IndianRupee } from "lucide-react";
import { CheckboxField } from "@/shared/components/CheckboxField.component";
import { doorstepConfirmCardStyles } from "./doorstepConfirmCard.styles";

interface DoorstepCodSectionProps {
  codAmount: number;
  codCollected: boolean;
  onCodCollectedChange: (checked: boolean) => void;
}

export function DoorstepCodSection({
  codAmount,
  codCollected,
  onCodCollectedChange,
}: DoorstepCodSectionProps) {
  return (
    <div className={doorstepConfirmCardStyles.codBox}>
      <div className={doorstepConfirmCardStyles.codHeader}>
        <IndianRupee
          className={doorstepConfirmCardStyles.codIcon}
          aria-hidden="true"
        />
        Cash on delivery: collect ₹{codAmount.toFixed(2)}
      </div>
      <CheckboxField
        id="doorstep-cod-collected"
        checked={codCollected}
        onCheckedChange={onCodCollectedChange}
        label={`I have collected ₹${codAmount.toFixed(2)} in cash from the customer`}
      />
    </div>
  );
}
