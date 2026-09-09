import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { PATHS } from "@/shared/constants/paths/paths";
import type {
  DeliveryAgent,
  DeliveryAgentRatings,
} from "@/features/delivery-dashboard";
import { operatingStatusAsideStyles as styles } from "../../../styles/delivery-operations/operatingStatusAside.styles";

interface OperatingStatusAsideProps {
  vehicleIcon: LucideIcon;
  agent: DeliveryAgent | undefined;
  ratingsData: DeliveryAgentRatings | undefined;
}

export function OperatingStatusAside({
  vehicleIcon: VehicleIcon,
  agent,
  ratingsData,
}: OperatingStatusAsideProps) {
  const ratingCount = ratingsData?.ratingCount ?? agent?.ratingCount;
  const averageRating = ratingsData?.averageRating ?? agent?.averageRating ?? 0;
  const formattedAverageRating = averageRating.toFixed(1);
  const ratingSuffix = ratingCount === 1 ? "" : "s";
  const ratingSummary = ratingCount ? (
    <>
      <Star className={styles.ratingStar} aria-hidden="true" />
      <span className={styles.ratingNumber}>{formattedAverageRating}</span>
      <span className={styles.ratingCount}>
        ({ratingCount} rating{ratingSuffix})
      </span>
    </>
  ) : (
    <span className={styles.ratingCount}>No ratings yet</span>
  );

  const partnerName = agent?.fullName ?? "Delivery Partner";
  const dutyStatusLabel = agent?.availableForAssignment
    ? "Available"
    : "Unavailable";
  const stationLabel = agent?.hubOrZone ?? "—";
  const systemStatus = agent?.status ?? "ACTIVE";

  return (
    <aside className={styles.root}>
      <div className={styles.card}>
        <div className={styles.header}>
          <TextEyebrow>OPERATING STATUS</TextEyebrow>
          <p className={styles.subtitle}>Live delivery partner status.</p>
        </div>

        <div className={styles.body}>
          <div className={styles.partnerRow}>
            <span className={styles.vehicleBadge}>
              <VehicleIcon size={20} strokeWidth={1.5} />
            </span>
            <div className={styles.partnerContent}>
              <p className={styles.partnerEyebrow}>Partner Name</p>
              <p className={styles.partnerName}>{partnerName}</p>
              <p className={styles.partnerPhone}>{agent?.phone}</p>
              <p className={styles.ratingRow}>{ratingSummary}</p>
            </div>
          </div>

          <div className={styles.statusBlock}>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Duty status:</span>
              <span className={styles.statusVal}>{dutyStatusLabel}</span>
            </div>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Station / Hub:</span>
              <span className={styles.stationVal}>{stationLabel}</span>
            </div>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>System status:</span>
              <StatusBadge status={systemStatus} />
            </div>
          </div>

          <div className={styles.actionsSection}>
            <Button
              variant="outline"
              className={styles.fieldQueueButton}
              asChild
            >
              <Link href={PATHS.delivery.today}>
                <span>Open Field Queue</span>
                <ArrowRight size={15} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
