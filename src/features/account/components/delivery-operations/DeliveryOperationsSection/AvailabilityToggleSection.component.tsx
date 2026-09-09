import { Switch } from "@/shared/components/ui/switch";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type { useSetAvailability } from "@/features/delivery-dashboard";

import { deliveryOperationsSectionStyles as styles } from "../../../styles/delivery-operations/deliveryOperationsSection.styles";

interface AvailabilityToggleSectionProps {
  availableForAssignment: boolean | undefined;
  hasAgent: boolean;
  availability: ReturnType<typeof useSetAvailability>;
}

export function AvailabilityToggleSection({
  availableForAssignment,
  hasAgent,
  availability,
}: AvailabilityToggleSectionProps) {
  const dutyBadgeClassName = availableForAssignment
    ? styles.dutyBadgeOn
    : styles.dutyBadgeOff;
  const dutyDotClassName = availableForAssignment
    ? styles.dutyDotOn
    : styles.dutyDotOff;
  const dutyLabel = availableForAssignment ? "On Duty" : "Off Duty";
  const switchChecked = availableForAssignment ?? false;
  const switchDisabled = !hasAgent || availability.isPending;
  const availabilityErrorMessage = getApiErrorMessage(
    availability.error,
    "Could not update availability.",
  );
  const availabilityErrorNotice = availability.isError ? (
    <p className={styles.availabilityErrorNotice}>{availabilityErrorMessage}</p>
  ) : null;

  return (
    <section className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <TextEyebrow>FIELD CONTROLS</TextEyebrow>
        <h2 className={styles.sectionTitle}>Live assignment availability</h2>
        <p className={styles.sectionSubtitle}>
          Configure whether operations can assign new deliveries and return
          pickups to you.
        </p>
      </div>

      <div className={styles.sectionBody}>
        <div className={styles.innerCard}>
          <div className={styles.textCol}>
            <div className={styles.dutyRow}>
              <span className={styles.titleText}>
                Available for task assignments
              </span>
              <span className={dutyBadgeClassName}>
                <span className={dutyDotClassName} />
                {dutyLabel}
              </span>
            </div>
            <p className={styles.bodyText}>
              Operations dispatch can assign active shipments and scheduled
              return pickups while enabled.
            </p>
          </div>

          <div className={styles.switchCol}>
            <Switch
              checked={switchChecked}
              disabled={switchDisabled}
              onCheckedChange={(checked) => availability.mutate(checked)}
            />
          </div>
        </div>
        {availabilityErrorNotice}
      </div>
    </section>
  );
}
