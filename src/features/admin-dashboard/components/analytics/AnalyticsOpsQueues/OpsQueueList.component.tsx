"use client";

import { OpsQueueItem, type QueueDef } from "./OpsQueueItem.component";
import { analyticsOpsQueuesStyles as styles } from "../../../styles/analytics/analyticsOpsQueues.styles";

interface OpsQueueListProps {
  queues: QueueDef[];
  counts: Record<string, number>;
}

export function OpsQueueList({ queues, counts }: OpsQueueListProps) {
  return (
    <div className={styles.grid}>
      {queues.map((queue) => (
        <OpsQueueItem
          key={queue.key}
          queue={queue}
          count={counts[queue.key] ?? 0}
        />
      ))}
    </div>
  );
}
