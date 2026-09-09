import type { UnassignedPickup } from "@/features/delivery-dashboard";
import { SelectContent } from "@/shared/components/ui/select";
import { DeliveryDispatchPickupGroup } from "./DeliveryDispatchPickupGroup.component";

interface ZoneGroup<T> {
  zone: string;
  rows: T[];
}

interface DeliveryDispatchPickupGroupsListProps {
  groups: ZoneGroup<UnassignedPickup>[];
}

export function DeliveryDispatchPickupGroupsList({
  groups,
}: DeliveryDispatchPickupGroupsListProps) {
  return (
    <SelectContent>
      {groups.map((group) => (
        <DeliveryDispatchPickupGroup key={group.zone} group={group} />
      ))}
    </SelectContent>
  );
}
