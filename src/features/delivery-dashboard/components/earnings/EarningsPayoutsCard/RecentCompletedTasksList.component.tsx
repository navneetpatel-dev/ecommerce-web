import { earningsPayoutsCardStyles } from "../../../styles/earnings/earningsPayoutsCard.styles";
import { RecentCompletedTaskItem } from "./RecentCompletedTaskItem.component";
import type { RecentTaskRowViewModel } from "../../../hooks/earnings/useEarningsPayoutsCardPresentation.hook";

interface RecentCompletedTasksListProps {
  tasks: RecentTaskRowViewModel[];
}

export function RecentCompletedTasksList({
  tasks,
}: RecentCompletedTasksListProps) {
  return (
    <ul className={earningsPayoutsCardStyles.recentList}>
      {tasks.map((task) => (
        <RecentCompletedTaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
