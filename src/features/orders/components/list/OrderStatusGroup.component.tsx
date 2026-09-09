import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { ORDER_STATUS_GROUP_STYLES } from "../../styles/list/orderStatusGroup.styles";
import { displayLabel, type Density } from "../../utils/list/orderStatusDisplay.utils";
import { CompactStatusLine } from "./CompactStatusLine.component";

interface OrderStatusGroupProps {
  orderStatus: string;
  paymentStatus?: string | null;
  density?: Density;
  className?: string;
}

/** Clearly separates fulfillment vs payment — never two unlabeled identical badges. */
export function OrderStatusGroup({
  orderStatus,
  paymentStatus,
  density = "comfortable",
  className,
}: OrderStatusGroupProps) {
  const orderLabel = displayLabel("order", orderStatus, density);
  const paymentLabel = paymentStatus
    ? displayLabel("payment", paymentStatus, density)
    : null;

  if (density === "compact") {
    return (
      <div
        className={ORDER_STATUS_GROUP_STYLES.compactGroup(className)}
        role="group"
        aria-label="Order and payment status"
      >
        <CompactStatusLine
          kind="order"
          status={orderStatus}
          label={orderLabel}
        />
        {paymentStatus && paymentLabel ? (
          <CompactStatusLine
            kind="payment"
            status={paymentStatus}
            label={paymentLabel}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={ORDER_STATUS_GROUP_STYLES.comfortableGroup(className)}
      role="group"
      aria-label="Order and payment status"
    >
      <div className={ORDER_STATUS_GROUP_STYLES.badgeContainer}>
        <p className={ORDER_STATUS_GROUP_STYLES.badgeLabel}>Order</p>
        <div className={ORDER_STATUS_GROUP_STYLES.badgeWrapper}>
          <StatusBadge
            status={orderStatus}
            label={orderLabel}
            className={ORDER_STATUS_GROUP_STYLES.badge}
          />
        </div>
      </div>
      {paymentStatus && paymentLabel ? (
        <div className={ORDER_STATUS_GROUP_STYLES.badgeContainer}>
          <p className={ORDER_STATUS_GROUP_STYLES.badgeLabel}>Payment</p>
          <div className={ORDER_STATUS_GROUP_STYLES.badgeWrapper}>
            <StatusBadge
              status={paymentStatus}
              label={paymentLabel}
              className={ORDER_STATUS_GROUP_STYLES.badge}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
