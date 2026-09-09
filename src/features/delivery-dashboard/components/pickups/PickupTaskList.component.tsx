import { TaskCard } from "../today/TaskCard.component";
import type { DeliveryPickup } from "../../types/agent/types";
import {
  pickupTaskCustomerSubtitle,
  pickupTaskTitle,
} from "../../utils/pickups/pickupTaskCopy";
import { PATHS } from "@/shared/constants/paths/paths";
import { deliveryListPageStyles as styles } from "../../pages/deliveries/deliveryListPage.styles";

interface PickupTaskListProps {
  pickups: DeliveryPickup[];
}

export function PickupTaskList({ pickups }: PickupTaskListProps) {
  return (
    <div className={styles.grid}>
      {pickups.map((pickup) => (
        <TaskCard
          key={pickup.id}
          href={PATHS.delivery.pickup(pickup.id)}
          title={pickupTaskTitle(pickup)}
          subtitle={pickupTaskCustomerSubtitle(pickup)}
          status={pickup.status}
        />
      ))}
    </div>
  );
}
