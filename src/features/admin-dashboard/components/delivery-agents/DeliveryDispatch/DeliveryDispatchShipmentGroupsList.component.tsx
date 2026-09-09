import type { UnassignedShipment } from "@/features/delivery-dashboard";
import { DeliveryDispatchShipmentGroup } from "./DeliveryDispatchShipmentGroup.component";

interface ZoneGroup<T> {
  zone: string;
  rows: T[];
}

interface DeliveryDispatchShipmentGroupsListProps {
  groups: ZoneGroup<UnassignedShipment>[];
  selectedIds: string[];
  onToggle: (id: string, checked: boolean) => void;
}

export function DeliveryDispatchShipmentGroupsList({
  groups,
  selectedIds,
  onToggle,
}: DeliveryDispatchShipmentGroupsListProps) {
  return (
    <>
      {groups.map((group) => (
        <DeliveryDispatchShipmentGroup
          key={group.zone}
          group={group}
          selectedIds={selectedIds}
          onToggle={onToggle}
        />
      ))}
    </>
  );
}
