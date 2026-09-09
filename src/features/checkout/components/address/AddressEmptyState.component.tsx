import { MapPin, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { ADDRESS_STEP_STYLES } from "../../styles/address/addressStep.styles";

interface AddressEmptyStateProps {
  onAddClick: () => void;
}

export function AddressEmptyState({ onAddClick }: AddressEmptyStateProps) {
  return (
    <div className={ADDRESS_STEP_STYLES.emptyContainer}>
      <span className={ADDRESS_STEP_STYLES.emptyIconWrapper}>
        <MapPin size={22} />
      </span>
      <div>
        <p className={ADDRESS_STEP_STYLES.emptyTitle}>Add a delivery address</p>
        <p className={ADDRESS_STEP_STYLES.emptyDescription}>
          Save where your order should arrive so checkout stays quick next time.
        </p>
      </div>
      <Button
        type="button"
        size="lg"
        onClick={onAddClick}
        className={ADDRESS_STEP_STYLES.addAddressBtn}
      >
        <Plus size={16} />
        {LABELS.addAddress}
      </Button>
    </div>
  );
}
