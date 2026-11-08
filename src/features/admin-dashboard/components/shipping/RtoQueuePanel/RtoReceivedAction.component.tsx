import { Button } from "@/shared/components/ui/button";
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
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={isPending}
      onClick={handleClick}
    >
      {LABELS.markRtoReceived}
    </Button>
  );
}
