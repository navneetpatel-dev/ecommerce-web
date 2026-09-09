import type { Shipment } from "@/shared/api/types";
import { subOrderShipmentTrackingStyles as styles } from "../../../styles/sub-order/subOrderShipmentTracking.styles";

interface ShipmentAttemptsListProps {
  attempts: NonNullable<Shipment["attempts"]>;
}

export function ShipmentAttemptsList({ attempts }: ShipmentAttemptsListProps) {
  return (
    <div className={styles.attemptsList}>
      {attempts.map((attempt) => (
        <p key={attempt.id} className={styles.warningNotice}>
          Attempt {attempt.attemptNumber} note: {attempt.note}
          {attempt.photoUrl ? (
            <a
              href={attempt.photoUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.viewPhotoLink}
            >
              View photo
            </a>
          ) : null}
        </p>
      ))}
    </div>
  );
}
