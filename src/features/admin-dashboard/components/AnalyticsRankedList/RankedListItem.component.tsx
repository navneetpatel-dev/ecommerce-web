"use client";

import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatAnalyticsInr } from "../../utils/analyticsFormat";
import { analyticsRankedListStyles as styles } from "./analyticsRankedList.styles";

export interface RankedItemData {
  id: string;
  label: string;
  revenue: number;
  sharePercent: number;
}

interface RankedListItemProps {
  item: RankedItemData;
  index: number;
  maxShare: number;
}

export function RankedListItem({ item, index, maxShare }: RankedListItemProps) {
  const width = Math.max((item.sharePercent / maxShare) * 100, 4);

  return (
    <li className={styles.itemContainer}>
      <div className={styles.itemHeader}>
        <div className={styles.itemLabelRow}>
          <span className={styles.rankIndex}>{index + 1}</span>
          <span className={styles.itemLabel}>{item.label}</span>
        </div>
        <span className={styles.itemRevenue}>
          {formatAnalyticsInr(item.revenue)}
        </span>
      </div>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${width}%` }} />
      </div>
      <p className={styles.shareText}>
        {formatLabel(LABELS.analyticsRankShare, {
          value: String(item.sharePercent),
        })}
      </p>
    </li>
  );
}
