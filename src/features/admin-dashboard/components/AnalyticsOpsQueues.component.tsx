"use client";

import { AlertTriangle, ClipboardList, Store, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { OpsQueueList } from "./AnalyticsOpsQueues/OpsQueueList.component";
import type { QueueDef } from "./AnalyticsOpsQueues/OpsQueueItem.component";
import { analyticsOpsQueuesStyles as styles } from "./AnalyticsOpsQueues/analyticsOpsQueues.styles";

interface AnalyticsOpsQueuesProps {
  pendingProducts: number;
  pendingVendors: number;
  pendingReviews: number;
}

const QUEUES: QueueDef[] = [
  {
    key: "products",
    label: LABELS.analyticsPendingProducts,
    href: PATHS.admin.products,
    icon: ClipboardList,
  },
  {
    key: "vendors",
    label: LABELS.analyticsPendingVendors,
    href: PATHS.admin.vendors,
    icon: Store,
  },
  {
    key: "reviews",
    label: LABELS.analyticsPendingReviews,
    href: PATHS.admin.reviews,
    icon: Star,
  },
];

export function AnalyticsOpsQueues({
  pendingProducts,
  pendingVendors,
  pendingReviews,
}: AnalyticsOpsQueuesProps) {
  const counts: Record<string, number> = {
    products: pendingProducts,
    vendors: pendingVendors,
    reviews: pendingReviews,
  };
  const total = pendingProducts + pendingVendors + pendingReviews;
  const hasAttention = total > 0;

  return (
    <Card className={styles.card(hasAttention)}>
      <CardHeader className={styles.header}>
        <div className={styles.titleGroup}>
          <AlertTriangle
            className={styles.attentionIcon(hasAttention)}
            aria-hidden
          />
          <CardTitle className={styles.title}>
            {LABELS.analyticsOpsQueues}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <OpsQueueList queues={QUEUES} counts={counts} />
      </CardContent>
    </Card>
  );
}
