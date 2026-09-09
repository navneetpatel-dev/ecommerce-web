"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { PATHS } from "@/shared/constants/paths/paths";
import { useOrdersActivitySection } from "../../hooks/orders-activity/useOrdersActivitySection.hook";
import { RecentOrdersList } from "./RecentOrdersList.component";
import { RecentOrdersEmptyState } from "./RecentOrdersEmptyState.component";
import { RecentOrdersLoadingSkeleton } from "./RecentOrdersLoadingSkeleton.component";
import { ActivitySummaryList } from "./ActivitySummaryList.component";
import { ordersActivitySectionStyles as styles } from "../../styles/orders-activity/ordersActivitySection.styles";

export function OrdersActivitySection() {
  const { orderViewModels, isLoadingStats, ordersSubtitle, summaryItems } =
    useOrdersActivitySection();

  return (
    <div className={styles.container}>
      <section className={styles.recentSection}>
        <div className={styles.header}>
          <div className={styles.headerDetails}>
            <TextEyebrow>Recent</TextEyebrow>
            <h2 className={styles.heading}>Recent orders</h2>
            <p className={styles.headerSubtitle}>{ordersSubtitle}</p>
          </div>
          <Link href={PATHS.orders} className={styles.viewAllLink}>
            View all
            <ChevronRight size={14} />
          </Link>
        </div>

        {isLoadingStats ? (
          <RecentOrdersLoadingSkeleton />
        ) : orderViewModels.length === 0 ? (
          <RecentOrdersEmptyState />
        ) : (
          <RecentOrdersList orders={orderViewModels} />
        )}
      </section>

      <ActivitySummaryList items={summaryItems} />
    </div>
  );
}
