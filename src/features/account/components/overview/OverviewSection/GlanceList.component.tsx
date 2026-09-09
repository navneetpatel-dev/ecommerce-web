import { GlanceRow, type GlanceRowProps } from "./GlanceRow.component";
import { glanceListStyles as styles } from "../../../styles/overview/glanceList.styles";

export interface GlanceItem extends GlanceRowProps {
  id: string;
}

interface GlanceListProps {
  items: GlanceItem[];
}

export function GlanceList({ items }: GlanceListProps) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <GlanceRow
          key={item.id}
          icon={item.icon}
          label={item.label}
          value={item.value}
          href={item.href}
          onDetails={item.onDetails}
        />
      ))}
    </ul>
  );
}
