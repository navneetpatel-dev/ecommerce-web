"use client";

import Link from "next/link";
import type { ElementType } from "react";
import { analyticsOpsQueuesStyles as styles } from "../../../styles/analytics/analyticsOpsQueues.styles";

export interface QueueDef {
  key: string;
  label: string;
  href: string;
  icon: ElementType;
}

interface OpsQueueItemProps {
  queue: QueueDef;
  count: number;
}

export function OpsQueueItem({ queue, count }: OpsQueueItemProps) {
  const Icon = queue.icon;

  return (
    <Link href={queue.href} className={styles.queueLink}>
      <div className={styles.leftGroup}>
        <span className={styles.iconWrapper}>
          <Icon className={styles.icon} aria-hidden />
        </span>
        <span className={styles.queueLabel}>{queue.label}</span>
      </div>
      <span className={styles.countText}>{count}</span>
    </Link>
  );
}
