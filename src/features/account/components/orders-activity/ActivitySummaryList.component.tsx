import type { ActivitySummaryItem } from "./useOrdersActivitySection.hook";
import { SummaryRow } from "./SummaryRow.component";
import { ordersActivitySectionStyles as styles } from "./ordersActivitySection.styles";

interface ActivitySummaryListProps {
  items: ActivitySummaryItem[];
}

export function ActivitySummaryList({ items }: ActivitySummaryListProps) {
  return (
    <ul className={styles.summariesList}>
      {items.map((item) => (
        <SummaryRow
          key={item.id}
          icon={item.icon}
          label={item.label}
          value={item.value}
          href={item.href}
        />
      ))}
    </ul>
  );
}
