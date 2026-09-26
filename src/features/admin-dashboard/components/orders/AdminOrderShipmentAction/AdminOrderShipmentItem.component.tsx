import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { ProofOfDeliveryThumbnail } from "@/shared/components/ProofOfDeliveryThumbnail";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { REFUND_STATUS } from "@/shared/constants/statuses";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import type { OrderShipmentSummary } from "@/shared/utils/orders/orderShipmentSummary";
import { adminOrderShipmentActionStyles as styles } from "../../../styles/orders/adminOrderShipmentAction.styles";

interface AdminOrderShipmentItemProps {
  shipment: OrderShipmentSummary;
  isRetrying: boolean;
  onRetryRefund: (subOrderId: string) => void;
}

export function AdminOrderShipmentItem({
  shipment,
  isRetrying,
  onRetryRefund,
}: AdminOrderShipmentItemProps) {
  const trackingLabel = shipment.trackingNumber
    ? `${LABELS.shipmentTrackingNumber} ${shipment.trackingNumber}`
    : LABELS.notShippedYet;
  const refundFailed = shipment.refundStatus === REFUND_STATUS.FAILED;
  const refundLabel = LABELS.partRefundLabel.replace(
    "{amount}",
    formatInr(shipment.refundAmount),
  );
  const handleRetryRefund = () => onRetryRefund(shipment.id);

  return (
    <li className={styles.itemCard}>
      <div className={styles.itemHeader}>
        <p className={styles.vendorName}>
          {shipment.vendorName || LABELS.shipment}
        </p>
        {shipment.status ? <StatusBadge status={shipment.status} /> : null}
      </div>
      <p className={styles.tracking}>{trackingLabel}</p>
      {shipment.refundAmount != null ? (
        <div className={styles.refundRow}>
          <span
            className={
              refundFailed ? styles.refundFailedText : styles.refundText
            }
          >
            {refundFailed ? LABELS.partRefundFailed : refundLabel}
          </span>
          {refundFailed ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isRetrying}
              onClick={handleRetryRefund}
            >
              {LABELS.retryRefund}
            </Button>
          ) : shipment.refundStatus ? (
            <StatusBadge status={shipment.refundStatus} />
          ) : null}
        </div>
      ) : null}
      <ProofOfDeliveryThumbnail url={shipment.proofOfDeliveryUrl} compact />
    </li>
  );
}
