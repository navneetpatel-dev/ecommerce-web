import { ImageIcon, Package } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { shipmentOverviewCardStyles as styles } from "../../styles/deliveries/shipmentOverviewCard.styles";

interface ShipmentOverviewCardProps {
  trackingNumber: string;
  status: string;
  orderId?: string | null;
  assignedAt?: string | null;
  items?: Array<{ id: string; productName: string; quantity: number }>;
  codAmount?: number | null;
  codCollected?: boolean;
  proofOfDeliveryUrl?: string | null;
  failureReason?: string | null;
  preferredRedeliverySlot?: string | null;
}

export function ShipmentOverviewCard({
  trackingNumber,
  status,
  orderId,
  assignedAt,
  items,
  codAmount,
  codCollected,
  proofOfDeliveryUrl,
  failureReason,
  preferredRedeliverySlot,
}: ShipmentOverviewCardProps) {
  const orderRefSection = orderId ? (
    <div className={styles.borderRow}>
      <dt className={styles.dt}>Order Ref</dt>
      <dd className={styles.ddOrderRef}>#{orderId.slice(0, 8)}</dd>
    </div>
  ) : null;

  const assignedAtTime = assignedAt
    ? new Date(assignedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;
  const assignedAtSection = assignedAt ? (
    <div className={styles.borderRow}>
      <dt className={styles.dt}>Assigned</dt>
      <dd className={styles.ddTime}>{assignedAtTime}</dd>
    </div>
  ) : null;

  const codStatusLabel = codCollected ? "collected" : "due";
  const codSection =
    codAmount != null ? (
      <div className={styles.borderRow}>
        <dt className={styles.dt}>Cash on delivery</dt>
        <dd className={styles.ddInkMedium}>
          ₹{codAmount.toFixed(2)}{" "}
          <span className={styles.codStatusSpan}>({codStatusLabel})</span>
        </dd>
      </div>
    ) : null;

  const failureNotice = failureReason ? (
    <p className={styles.failureNotice}>
      <span className={styles.failureNoticeMuted}>Last attempt failed: </span>
      {failureReason}
    </p>
  ) : null;
  const redeliveryNotice = preferredRedeliverySlot ? (
    <p className={styles.redeliveryNotice}>
      Customer requested redelivery: {preferredRedeliverySlot}
    </p>
  ) : null;
  const hasFailureOrRedeliveryNotice = Boolean(
    failureReason || preferredRedeliverySlot,
  );
  const failureOrRedeliverySection = hasFailureOrRedeliveryNotice ? (
    <div className={styles.noticeSection}>
      {failureNotice}
      {redeliveryNotice}
    </div>
  ) : null;

  const itemRows = (items ?? []).map((item) => (
    <li key={item.id} className={styles.itemRow}>
      {item.productName}{" "}
      <span className={styles.itemQuantity}>× {item.quantity}</span>
    </li>
  ));
  const itemsSection = items?.length ? (
    <div className={styles.itemsSection}>
      <p className={styles.itemsSectionHeading}>Package contents</p>
      <ul className={styles.itemsList}>{itemRows}</ul>
    </div>
  ) : null;

  const proofLink = proofOfDeliveryUrl ? (
    <a
      href={proofOfDeliveryUrl}
      target="_blank"
      rel="noreferrer"
      className={styles.proofLink}
    >
      <ImageIcon className={styles.proofIcon} aria-hidden="true" />
      View proof of delivery photo
    </a>
  ) : null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Package className={styles.headerIcon} aria-hidden="true" />
        <TextEyebrow className={styles.eyebrow}>Shipment Details</TextEyebrow>
      </div>
      <div className={styles.body}>
        <dl className={styles.dlList}>
          <div className={styles.row}>
            <dt className={styles.dt}>Tracking #</dt>
            <dd className={styles.ddMono}>{trackingNumber}</dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.dt}>Status</dt>
            <dd>
              <StatusBadge status={status} />
            </dd>
          </div>
          {orderRefSection}
          {assignedAtSection}
          {codSection}
        </dl>

        {failureOrRedeliverySection}

        {itemsSection}

        {proofLink}
      </div>
    </div>
  );
}
