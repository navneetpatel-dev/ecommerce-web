import { IndianRupee } from "lucide-react";
import { CheckboxField } from "@/shared/components/CheckboxField.component";
import { doorstepConfirmCardStyles } from "../../../styles/doorstep/doorstepConfirmCard.styles";
import { formatInrExact } from "@/shared/utils/formatting/orderFormat";

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
        Cash on delivery: collect {formatInrExact(codAmount)}
      </div>
      <CheckboxField
        id="doorstep-cod-collected"
        checked={codCollected}
        onCheckedChange={onCodCollectedChange}
        label={`I have collected ${formatInrExact(codAmount)} in cash from the customer`}
      />
    </div>
  );
}
