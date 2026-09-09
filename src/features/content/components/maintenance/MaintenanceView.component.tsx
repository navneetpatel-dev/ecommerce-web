import { LABELS } from "@/shared/constants/labels";
import { maintenanceViewStyles as styles } from "../../styles/maintenance/maintenanceView.styles";

export function MaintenanceView() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1
          className={styles.heading}
          style={{ fontSize: "var(--text-display-sm)" }}
        >
          {LABELS.maintenanceHeading}
        </h1>
        <p className={styles.bodyText}>{LABELS.maintenanceBody}</p>
      </div>
    </div>
  );
}
