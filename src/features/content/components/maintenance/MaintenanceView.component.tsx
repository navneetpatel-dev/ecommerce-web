import { LABELS } from "@/shared/constants/labels";
import { maintenanceViewStyles as styles } from "../../styles/maintenance/maintenanceView.styles";

interface MaintenanceViewProps {
  message: string;
  backBy: string | null;
}

export function MaintenanceView({ message, backBy }: MaintenanceViewProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.heading}>{LABELS.maintenanceHeading}</h1>
        <p className={styles.bodyText}>{message}</p>
        {backBy ? <p className={styles.backBy}>{backBy}</p> : null}
      </div>
    </div>
  );
}
