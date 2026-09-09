import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import type { Order } from "@/shared/api/types";
import { OrderStatusGroup } from "../list/OrderStatusGroup.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { useOrderDetailHeader } from "./useOrderDetailHeader.hook";
import { ORDER_DETAIL_HEADER_STYLES } from "./orderDetailHeader.styles";

interface OrderDetailHeaderProps {
  order: Order;
  itemCount: number;
  vendorCount: number;
}

/** Page header for the order detail screen (Rule 3 split). */
export function OrderDetailHeader({
  order,
  itemCount,
  vendorCount,
}: OrderDetailHeaderProps) {
  const { orderIdShort, metaText } = useOrderDetailHeader({
    order,
    itemCount,
    vendorCount,
  });

  return (
    <header>
      <Link href={PATHS.orders} className={ORDER_DETAIL_HEADER_STYLES.backLink}>
        <ArrowLeft
          className={ORDER_DETAIL_HEADER_STYLES.backIcon}
          strokeWidth={1.5}
        />
        {LABELS.backToOrders}
      </Link>

      <TextEyebrow brand>{LABELS.orderDetails}</TextEyebrow>
      <div className={ORDER_DETAIL_HEADER_STYLES.headerGrid}>
        <div>
          <h1
            className={ORDER_DETAIL_HEADER_STYLES.heading}
            style={ORDER_DETAIL_HEADER_STYLES.headingStyle}
          >
            Order #{orderIdShort}
          </h1>
          <p className={ORDER_DETAIL_HEADER_STYLES.metaText}>{metaText}</p>
          <OrderStatusGroup
            className={ORDER_DETAIL_HEADER_STYLES.statusGroupMargin}
            orderStatus={order.status}
            paymentStatus={order.paymentStatus}
          />
          {order.giftWrap ? (
            <div className={ORDER_DETAIL_HEADER_STYLES.giftWrapBox}>
              <p className={ORDER_DETAIL_HEADER_STYLES.giftWrapBadge}>
                🎁 {LABELS.giftWrappedBadge}
              </p>
              {order.giftMessage ? (
                <p className={ORDER_DETAIL_HEADER_STYLES.giftWrapMessage}>
                  {order.giftMessage}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
