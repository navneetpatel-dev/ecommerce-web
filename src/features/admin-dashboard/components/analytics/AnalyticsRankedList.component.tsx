"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { LABELS } from "@/shared/constants/labels";
import { RankedListItems } from "./AnalyticsRankedList/RankedListItems.component";
import type { RankedItemData } from "./AnalyticsRankedList/RankedListItem.component";
import { analyticsRankedListStyles as styles } from "../../styles/analytics/analyticsRankedList.styles";

interface AnalyticsRankedListProps {
  title: string;
  items: RankedItemData[];
}

export function AnalyticsRankedList({
  title,
  items,
}: AnalyticsRankedListProps) {
  const maxShare = Math.max(...items.map((item) => item.sharePercent), 1);

  const content = !items.length ? (
    <p className={styles.emptyText}>{LABELS.analyticsEmptyChart}</p>
  ) : (
    <RankedListItems items={items} maxShare={maxShare} />
  );

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.header}>
        <CardTitle className={styles.title}>{title}</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
