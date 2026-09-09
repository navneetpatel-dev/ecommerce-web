import type { UnassignedPickup } from "@/features/delivery-dashboard";
import { SelectGroup, SelectItem } from "@/shared/components/ui/select";
import { deliveryDispatchZoneLabels } from "@/shared/constants/labels/deliveryDispatchZones";
import { formatLabel } from "@/shared/utils/formatLabel";

interface ZoneGroup<T> {
  zone: string;
  rows: T[];
}

interface DeliveryDispatchPickupGroupProps {
  group: ZoneGroup<UnassignedPickup>;
}

export function DeliveryDispatchPickupGroup({
  group,
}: DeliveryDispatchPickupGroupProps) {
  const headerText = formatLabel(deliveryDispatchZoneLabels.zoneGroupHeader, {
    zone: group.zone,
    count: group.rows.length,
  });

  return (
    <SelectGroup>
      <SelectItem value={`__zone_${group.zone}__`} disabled>
        {headerText}
      </SelectItem>
      {group.rows.map((pickup) => (
        <SelectItem key={pickup.id} value={pickup.id}>
          {pickup.productName ?? `Return ${pickup.id.slice(0, 8)}`}
          {pickup.customerName ? ` · ${pickup.customerName}` : ""}
        </SelectItem>
      ))}
    </SelectGroup>
  );
}
