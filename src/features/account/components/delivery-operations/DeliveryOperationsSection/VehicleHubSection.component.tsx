import { MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";

import { deliveryOperationsSectionStyles as styles } from "../../../styles/delivery-operations/deliveryOperationsSection.styles";

interface VehicleHubSectionProps {
  vehicleIcon: LucideIcon;
  vehicleType: string | undefined;
  hubOrZone: string | undefined;
}

export function VehicleHubSection({
  vehicleIcon: VehicleIcon,
  vehicleType,
  hubOrZone,
}: VehicleHubSectionProps) {
  const vehicleTypeLabel = vehicleType ?? "Not registered";
  const hubOrZoneLabel = hubOrZone ?? "Unassigned";

  return (
    <section className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <TextEyebrow>DISPATCH REGISTRY</TextEyebrow>
        <h2 className={styles.sectionTitle}>Fleet details & operating zone</h2>
        <p className={styles.sectionSubtitle}>
          Your registered vehicle class and geographic operating zone.
        </p>
      </div>

      <div className={styles.sectionBodySpaced}>
        <div className={styles.fleetGrid}>
          <div className={styles.fleetItem}>
            <span className={styles.iconBoxLg}>
              <VehicleIcon size={20} strokeWidth={1.5} />
            </span>
            <div>
              <p className={styles.fleetLabel}>Vehicle Class</p>
              <p className={styles.fleetValue}>{vehicleTypeLabel}</p>
            </div>
          </div>

          <div className={styles.fleetItem}>
            <span className={styles.iconBoxLg}>
              <MapPin size={20} strokeWidth={1.5} />
            </span>
            <div>
              <p className={styles.fleetLabel}>Operating Hub / Zone</p>
              <p className={styles.fleetValue}>{hubOrZoneLabel}</p>
            </div>
          </div>
        </div>

        <p className={styles.fleetFooterHint}>
          Vehicle type and hub assignments are verified and updated by the
          platform operations team.
        </p>
      </div>
    </section>
  );
}
