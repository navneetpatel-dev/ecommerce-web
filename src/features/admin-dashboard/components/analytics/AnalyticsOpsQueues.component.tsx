"use client";

import { useMemo } from "react";
import {
  AlertTriangle,
  ClipboardList,
  Store,
  Star,
  RotateCcw,
  Headphones,
  Truck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { OpsQueueList } from "./AnalyticsOpsQueues/OpsQueueList.component";
import type { QueueDef } from "./AnalyticsOpsQueues/OpsQueueItem.component";
import { analyticsOpsQueuesStyles as styles } from "../../styles/analytics/analyticsOpsQueues.styles";

interface AnalyticsOpsQueuesProps {
  pendingProducts: number;
  pendingVendors: number;
  pendingReviews: number;
}

const ALL_QUEUES: QueueDef[] = [
  {
    key: "products",
    label: LABELS.analyticsPendingProducts,
    href: PATHS.admin.products,
    icon: ClipboardList,
    permissions: [PERMISSIONS.PRODUCT_APPROVE, PERMISSIONS.PRODUCT_MANAGE],
  },
  {
    key: "vendors",
    label: LABELS.analyticsPendingVendors,
    href: PATHS.admin.vendors,
    icon: Store,
    permissions: [PERMISSIONS.VENDOR_APPROVE, PERMISSIONS.VENDOR_MANAGE],
  },
  {
    key: "reviews",
    label: LABELS.analyticsPendingReviews,
    href: PATHS.admin.reviews,
    icon: Star,
    permissions: [PERMISSIONS.REVIEW_MODERATE],
  },
  {
    key: "returns",
    label: LABELS.analyticsPendingReturns,
    href: PATHS.admin.returns,
    icon: RotateCcw,
    permissions: [PERMISSIONS.ORDER_REFUND, PERMISSIONS.ORDER_MANAGE],
  },
  {
    key: "tickets",
    label: LABELS.analyticsOpenTickets,
    href: PATHS.admin.supportTickets,
    icon: Headphones,
    permissions: [PERMISSIONS.TICKET_MANAGE],
  },
  {
    key: "rto",
    label: LABELS.analyticsPendingRto,
    href: PATHS.admin.shipping,
    icon: Truck,
    permissions: [PERMISSIONS.SHIPPING_MANAGE, PERMISSIONS.ORDER_MANAGE],
  },
];

export function AnalyticsOpsQueues({
  pendingProducts,
  pendingVendors,
  pendingReviews,
}: AnalyticsOpsQueuesProps) {
  const { hasAnyPermission } = usePermissions();

  const visibleQueues = useMemo(
    () => ALL_QUEUES.filter((q) => hasAnyPermission(...q.permissions)),
    [hasAnyPermission],
  );

  const counts: Record<string, number | undefined> = {
    products: pendingProducts,
    vendors: pendingVendors,
    reviews: pendingReviews,
  };

  const hasAttention = visibleQueues.some((q) => (counts[q.key] ?? 0) > 0);

  if (visibleQueues.length === 0) {
    return null;
  }

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
        <OpsQueueList queues={visibleQueues} counts={counts} />
      </CardContent>
    </Card>
  );
}
