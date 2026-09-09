import { useCallback } from "react";
import type { UnassignedShipment } from "@/features/delivery-dashboard";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { deliveryDispatchShipmentListStyles } from "../../../styles/delivery-agents/deliveryDispatchShipmentList.styles";

interface DeliveryDispatchShipmentRowProps {
  shipment: UnassignedShipment;
  isSelected: boolean;
  onToggle: (id: string, checked: boolean) => void;
}

export function DeliveryDispatchShipmentRow({
  shipment,
  isSelected,
  onToggle,
}: DeliveryDispatchShipmentRowProps) {
  const handleCheckedChange = useCallback(
    (checked: boolean | "indeterminate") => {
      onToggle(shipment.id, Boolean(checked));
    },
    [onToggle, shipment.id],
  );

  return (
    <label
      className={deliveryDispatchShipmentListStyles.shipmentRow(isSelected)}
    >
      <Checkbox checked={isSelected} onCheckedChange={handleCheckedChange} />
      <span className={deliveryDispatchShipmentListStyles.trackingNumber}>
        {shipment.trackingNumber}
      </span>
      {shipment.vendorName ? (
        <span className={deliveryDispatchShipmentListStyles.vendorBadge}>
          {shipment.vendorName}
        </span>
      ) : null}
    </label>
  );
}
