import { SelectItem } from "@/shared/components/ui/select";
import type { AdminShipmentStatus } from "../../../api/shipping/shipping.api";
import { ADMIN_SHIPMENT_STATUS_LABELS } from "../../../constants/shipping/adminShipmentStatus";

interface AdminShipmentStatusOptionsProps {
  statuses: readonly AdminShipmentStatus[];
}

export function AdminShipmentStatusOptions({
  statuses,
}: AdminShipmentStatusOptionsProps) {
  return (
    <>
      {statuses.map((status) => (
        <SelectItem key={status} value={status}>
          {ADMIN_SHIPMENT_STATUS_LABELS[status]}
        </SelectItem>
      ))}
    </>
  );
}
