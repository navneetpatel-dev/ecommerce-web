import type { DeliveryShipment } from "@/features/delivery-dashboard";
import { RtoQueueTableRow } from "./RtoQueueTableRow.component";

interface RtoQueueTableBodyProps {
  shipments: DeliveryShipment[];
}

export function RtoQueueTableBody({ shipments }: RtoQueueTableBodyProps) {
  return (
    <tbody>
      {shipments.map((shipment) => (
        <RtoQueueTableRow key={shipment.id} shipment={shipment} />
      ))}
    </tbody>
  );
}
