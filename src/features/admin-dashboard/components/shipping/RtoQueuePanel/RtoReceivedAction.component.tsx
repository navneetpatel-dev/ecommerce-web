import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import { PackageCheck } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";

interface RtoReceivedActionProps {
  shipmentId: string;
  status: string;
  isPending: boolean;
  onMarkReceived: (shipmentId: string) => void;
}

/** Confirms a returning parcel is back with the seller (RTO_INITIATED → RTO_DELIVERED). */
export function RtoReceivedAction({
  shipmentId,
  status,
  isPending,
  onMarkReceived,
}: RtoReceivedActionProps) {
  if (status !== "RTO_INITIATED") return null;
  const handleClick = () => onMarkReceived(shipmentId);

  return (
    <RowActionButton
      icon={PackageCheck}
      label={LABELS.markRtoReceived}
      loading={isPending}
      onClick={handleClick}
    />
  );
}
