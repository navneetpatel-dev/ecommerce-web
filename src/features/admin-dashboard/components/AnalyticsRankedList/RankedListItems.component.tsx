"use client";

import {
  RankedListItem,
  type RankedItemData,
} from "./RankedListItem.component";
import { analyticsRankedListStyles as styles } from "./analyticsRankedList.styles";

interface RankedListItemsProps {
  items: RankedItemData[];
  maxShare: number;
}

export function RankedListItems({ items, maxShare }: RankedListItemsProps) {
  return (
    <ol className={styles.list}>
      {items.map((item, index) => (
        <RankedListItem
          key={item.id}
          item={item}
          index={index}
          maxShare={maxShare}
        />
      ))}
    </ol>
  );
}
