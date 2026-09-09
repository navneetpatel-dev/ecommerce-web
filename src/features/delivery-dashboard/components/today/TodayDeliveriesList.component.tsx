import { TaskCard } from "./TaskCard.component";
import type { DeliveryShipment } from "../../types/agent/types";
import { PATHS } from "@/shared/constants/paths/paths";
import { todayPageStyles } from "../../pages/today/todayPage.styles";

interface TodayDeliveriesListProps {
  shipments: DeliveryShipment[];
}

export function TodayDeliveriesList({ shipments }: TodayDeliveriesListProps) {
  return (
    <div className={todayPageStyles.taskList}>
      {shipments.map((shipment) => (
        <TaskCard
          key={shipment.id}
          href={PATHS.delivery.delivery(shipment.id)}
          title={shipment.trackingNumber}
          subtitle={shipment.subOrder?.order?.shippingAddress?.city}
          status={shipment.status}
        />
      ))}
    </div>
  );
}
