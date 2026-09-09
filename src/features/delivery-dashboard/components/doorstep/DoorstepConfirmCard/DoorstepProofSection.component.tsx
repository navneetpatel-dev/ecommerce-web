import { Upload } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { doorstepConfirmCardStyles } from "../../../styles/doorstep/doorstepConfirmCard.styles";

interface DoorstepProofSectionProps {
  proof: File | null;
  onProofInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DoorstepProofSection({
  proof,
  onProofInputChange,
}: DoorstepProofSectionProps) {
  return (
    <div className={doorstepConfirmCardStyles.proofBox}>
      <label className={doorstepConfirmCardStyles.proofLabel}>
        <div className={doorstepConfirmCardStyles.proofIconWrapper}>
          <Upload
            className={doorstepConfirmCardStyles.proofIcon}
            aria-hidden="true"
          />
        </div>
        <span className={doorstepConfirmCardStyles.proofText}>
          {proof ? proof.name : "Add proof of delivery photo (optional)"}
        </span>
        <Input
          className={doorstepConfirmCardStyles.proofInput}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onProofInputChange}
        />
      </label>
    </div>
  );
}
