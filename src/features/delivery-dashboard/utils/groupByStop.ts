import type { DeliveryShipment } from "../types";

export interface DeliveryStop {
  key: string;
  addressText: string | null;
  shipments: DeliveryShipment[];
}

/**
 * Groups shipments bound for the same customer + address into one "stop" so
 * an agent with several sub-orders to one doorstep sees them together.
 * Falls back to a one-shipment stop when address fields are missing —
 * grouping is a display nicety, never a reason to hide a task.
 */
export function groupShipmentsByStop(
  shipments: DeliveryShipment[],
): DeliveryStop[] {
  const stops = new Map<string, DeliveryStop>();

  shipments.forEach((shipment, index) => {
    const order = shipment.subOrder?.order;
    const address = order?.shippingAddress;
    const key =
      order?.userId && address?.line1 && address?.city && address?.pincode
        ? `${order.userId}|${address.line1}|${address.city}|${address.pincode}`
        : `__ungrouped:${shipment.id ?? index}`;

    const existing = stops.get(key);
    if (existing) {
      existing.shipments.push(shipment);
    } else {
      stops.set(key, {
        key,
        addressText: address
          ? [address.line1, address.city, address.pincode]
              .filter(Boolean)
              .join(", ")
          : null,
        shipments: [shipment],
      });
    }
  });

  return Array.from(stops.values());
}
