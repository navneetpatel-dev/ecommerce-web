import { TaskCard } from "./TaskCard.component";
import type { DeliveryPickup } from "../../types/agent/types";
import {
  pickupTaskCitySubtitle,
  pickupTaskTitle,
} from "../../utils/pickups/pickupTaskCopy";
import { PATHS } from "@/shared/constants/paths/paths";
import { todayPageStyles } from "../../pages/today/todayPage.styles";

interface TodayPickupsListProps {
  pickups: DeliveryPickup[];
}

export function TodayPickupsList({ pickups }: TodayPickupsListProps) {
  return (
    <div className={todayPageStyles.taskList}>
      {pickups.map((pickup) => (
        <TaskCard
          key={pickup.id}
          href={PATHS.delivery.pickup(pickup.id)}
          title={pickupTaskTitle(pickup)}
          subtitle={pickupTaskCitySubtitle(pickup)}
          status={pickup.status}
        />
      ))}
    </div>
  );
}
