import { earningsPayoutsCardStyles } from "./earningsPayoutsCard.styles";
import type { RecentTaskRowViewModel } from "./useEarningsPayoutsCardPresentation.hook";

interface RecentCompletedTaskItemProps {
  task: RecentTaskRowViewModel;
}

export function RecentCompletedTaskItem({
  task,
}: RecentCompletedTaskItemProps) {
  return (
    <li className={earningsPayoutsCardStyles.recentItem}>
      <span>
        {task.typeLabel} · {task.dateLabel}
      </span>
      <span className={earningsPayoutsCardStyles.recentAmount}>
        {task.amountLabel}
      </span>
    </li>
  );
}
