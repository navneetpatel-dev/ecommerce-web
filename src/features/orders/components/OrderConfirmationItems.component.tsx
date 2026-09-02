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

interface OrderConfirmationItemsProps {
  order: Pick<Order, "subOrders">;
}

/**
 * One ordered line, laid out like a cart line so the two read as the same
 * object at different stages: media, what it is, what it cost.
 */
function OrderLine({ item }: { item: OrderItem }) {
  const attrs = orderLineVariantLabel(item);
  const nameClassName =
    "block text-body font-medium leading-snug text-ink transition-colors";

  return (
    <li className="grid grid-cols-[3.5rem_1fr] items-start gap-3 py-3 sm:grid-cols-[4rem_1fr_auto] sm:gap-4">
      {/* MediaImage renders <Image fill>, which is absolutely positioned —
          this wrapper must stay `relative` or the thumbnail escapes it. */}
      <div className="relative aspect-square self-start overflow-hidden rounded-sm border border-line bg-paper">
        <MediaImage
          src={item.imageUrl}
          alt={item.productName}
          sizes="88px"
          imageClassName="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-col gap-0.5">
        {item.productSlug ? (
          <Link
            href={PATHS.product(item.productSlug)}
            className={`${nameClassName} hover:text-brand`}
          >
            {item.productName}
          </Link>
        ) : (
          <p className={nameClassName}>{item.productName}</p>
        )}

        {attrs ? (
          <p className="font-mono text-[0.6875rem] tracking-wide text-ink-muted">
            {attrs}
          </p>
        ) : null}

        <p className="mt-1 text-body-sm text-ink-muted">
          {formatLabel(LABELS.qtyLabel, { count: String(item.quantity) })}
        </p>

        <p className="mt-1 font-display text-[1.125rem] tabular-nums text-ink sm:hidden">
          {formatInr(item.lineTotal)}
        </p>
      </div>

      <div className="hidden flex-col items-end gap-1 sm:flex">
        <p className="font-display text-[1.125rem] tabular-nums text-ink">
          {formatInr(item.lineTotal)}
        </p>
        {item.quantity > 1 ? (
          <p className="text-[0.75rem] tabular-nums text-ink-muted">
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
    <div className="space-y-4">
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
              className="mb-1"
            />
            <ul className="divide-y divide-line">
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
