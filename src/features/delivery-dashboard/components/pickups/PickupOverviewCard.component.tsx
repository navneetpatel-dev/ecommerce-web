import { RotateCcw } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { pickupOverviewCardStyles as styles } from "./pickupOverviewCard.styles";

interface PickupOverviewCardProps {
  returnId: string;
  type: "REFUND" | "EXCHANGE";
  status: string;
  orderId?: string | null;
  productName?: string | null;
}

export function PickupOverviewCard({
  returnId,
  type,
  status,
  orderId,
  productName,
}: PickupOverviewCardProps) {
  const itemSection = productName ? (
    <div className={styles.itemSection}>
      <dt className={styles.dt}>Item</dt>
      <dd className={styles.ddProductName}>{productName}</dd>
    </div>
  ) : null;
  const orderRefSection = orderId ? (
    <div className={styles.orderRefRow}>
      <dt className={styles.dt}>Order Ref</dt>
      <dd className={styles.ddOrderRef}>#{orderId.slice(0, 8)}</dd>
    </div>
  ) : null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <RotateCcw className={styles.headerIcon} aria-hidden="true" />
        <TextEyebrow className={styles.eyebrow}>Pickup Details</TextEyebrow>
      </div>
      <div className={styles.body}>
        <dl className={styles.dlList}>
          <div className={styles.row}>
            <dt className={styles.dt}>Return ID</dt>
            <dd className={styles.ddMono}>#{returnId.slice(0, 8)}</dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.dt}>Type</dt>
            <dd className={styles.ddType}>{type}</dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.dt}>Status</dt>
            <dd>
              <StatusBadge status={status} />
            </dd>
          </div>
          {itemSection}
          {orderRefSection}
        </dl>
      </div>
    </div>
  );
}
