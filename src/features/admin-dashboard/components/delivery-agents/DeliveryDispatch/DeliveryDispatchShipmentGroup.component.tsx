import type { UnassignedShipment } from "@/features/delivery-dashboard";
import { deliveryDispatchZoneLabels } from "@/shared/constants/labels/deliveryDispatchZones";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { deliveryDispatchShipmentListStyles } from "./deliveryDispatchShipmentList.styles";
import { DeliveryDispatchShipmentRow } from "./DeliveryDispatchShipmentRow.component";

interface ZoneGroup<T> {
  zone: string;
  rows: T[];
}

interface DeliveryDispatchShipmentGroupProps {
  group: ZoneGroup<UnassignedShipment>;
  selectedIds: string[];
  onToggle: (id: string, checked: boolean) => void;
}

export function DeliveryDispatchShipmentGroup({
  group,
  selectedIds,
  onToggle,
}: DeliveryDispatchShipmentGroupProps) {
  const headerText = formatLabel(deliveryDispatchZoneLabels.zoneGroupHeader, {
    zone: group.zone,
    count: group.rows.length,
  });

  return (
    <div className={deliveryDispatchShipmentListStyles.groupWrapper}>
      <div className={deliveryDispatchShipmentListStyles.groupBadgeWrapper}>
        <span className={deliveryDispatchShipmentListStyles.groupBadge}>
          {headerText}
        </span>
      </div>
      <div className={deliveryDispatchShipmentListStyles.groupRows}>
        {group.rows.map((shipment) => (
          <DeliveryDispatchShipmentRow
            key={shipment.id}
            shipment={shipment}
            isSelected={selectedIds.includes(shipment.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}
