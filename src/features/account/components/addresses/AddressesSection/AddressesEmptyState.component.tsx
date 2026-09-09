import { MapPin } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { addressesSectionStyles as styles } from "../../../styles/addresses/addressesSection.styles";

interface AddressesEmptyStateProps {
  onAddAddress: () => void;
}

export function AddressesEmptyState({
  onAddAddress,
}: AddressesEmptyStateProps) {
  return (
    <div className={styles.emptyWrapper}>
      <EmptyState
        icon={MapPin}
        heading="Add a delivery address"
        message="Save where orders should arrive so checkout stays quick."
        actionLabel="Add address"
        onAction={onAddAddress}
        className={styles.emptyState}
      />
    </div>
  );
}
