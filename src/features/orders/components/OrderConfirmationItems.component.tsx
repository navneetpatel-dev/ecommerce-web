import Link from "next/link";
import { MediaImage } from "@/shared/components/MediaImage.component";
import { VendorGroupHeader } from "@/shared/components/VendorGroupHeader.component";
import { VENDOR_GROUP_CARD } from "@/shared/components/vendorGroupStyles";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInr } from "../utils/format";
import { orderLineVariantLabel } from "../utils/orderLine.utils";
import type { Order, OrderItem } from "@/shared/api/types";
import { orderConfirmationStyles as styles } from "./orderConfirmation.styles";

interface OrderConfirmationItemsProps {
  order: Pick<Order, "subOrders">;
}

/**
 * One ordered line, laid out like a cart line so the two read as the same
 * object at different stages: media, what it is, what it cost.
 */
function OrderLine({ item }: { item: OrderItem }) {
  const attrs = orderLineVariantLabel(item);

  return (
    <li className={styles.lineRoot}>
      {/* MediaImage renders <Image fill>, which is absolutely positioned —
          this wrapper must stay `relative` or the thumbnail escapes it. */}
      <div className={styles.lineMediaWrapper}>
        <MediaImage
          src={item.imageUrl}
          alt={item.productName}
          sizes="88px"
          imageClassName={styles.lineMediaImage}
        />
      </div>

      <div className={styles.lineContent}>
        {item.productSlug ? (
          <Link
            href={PATHS.product(item.productSlug)}
            className={styles.lineNameLink}
          >
            {item.productName}
          </Link>
        ) : (
          <p className={styles.lineName}>{item.productName}</p>
        )}

        {attrs ? <p className={styles.lineAttrs}>{attrs}</p> : null}

        <p className={styles.lineQty}>
          {formatLabel(LABELS.qtyLabel, { count: String(item.quantity) })}
        </p>

        <p className={styles.lineTotalMobile}>{formatInr(item.lineTotal)}</p>
      </div>

      <div className={styles.lineTotalDesktopCol}>
        <p className={styles.lineTotalDesktop}>{formatInr(item.lineTotal)}</p>
        {item.quantity > 1 ? (
          <p className={styles.lineUnitPrice}>
            {formatInr(item.unitPrice)} {LABELS.each}
          </p>
        ) : null}
      </div>
    </li>
  );
}

/**
 * What was actually ordered, grouped by the vendor who fulfils each package.
 *
 * Quantities and amounts are the frozen values the backend persisted with the
 * order — never recomputed here.
 */
export function OrderConfirmationItems({ order }: OrderConfirmationItemsProps) {
  const subOrders = order.subOrders ?? [];
  if (subOrders.length === 0) return null;

  return (
    <div className={styles.itemsWrapper}>
      {subOrders.map((subOrder) => {
        const items = subOrder.items ?? [];
        return (
          <section key={subOrder.id} className={VENDOR_GROUP_CARD}>
            <VendorGroupHeader
              vendorName={
                subOrder.vendor?.businessName || LABELS.sellerFallback
              }
              vendorId={subOrder.vendor?.id}
              count={items.length}
              as="h3"
              className={styles.vendorHeaderMargin}
            />
            <ul className={styles.itemsList}>
              {items.map((item) => (
                <OrderLine key={item.id} item={item} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
