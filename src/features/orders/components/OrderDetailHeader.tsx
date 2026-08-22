import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { formatLabel } from "@/shared/utils/formatLabel";
import type { Order } from "@/shared/api/types";
import { OrderStatusGroup } from "./OrderStatusGroup";
import { TextEyebrow } from "@/shared/components/TextEyebrow";
import { formatOrderDate, shortOrderId } from "../utils/format";

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
  const placedCopy = formatLabel(LABELS.placedOn, {
    date: formatOrderDate(order.createdAt),
  });

  return (
    <header>
      <Link
        href={PATHS.orders}
        className="mb-4 inline-flex items-center gap-1.5 text-[0.875rem] text-ink-muted transition-colors hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        {LABELS.backToOrders}
      </Link>

      <TextEyebrow brand>{LABELS.orderDetails}</TextEyebrow>
      <div className="mt-1.5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1
            className="font-display text-ink leading-[1.1] tracking-tight"
            style={{ fontSize: "var(--text-display-sm)" }}
          >
            Order #{shortOrderId(order.id)}
          </h1>
          <p className="mt-2 text-[0.875rem] text-ink-muted">
            {placedCopy}
            {vendorCount > 0 && (
              <>
                {" · "}
                {vendorCount}{" "}
                {vendorCount === 1
                  ? LABELS.sellerSingular
                  : LABELS.sellerPlural}
                {" · "}
                {itemCount}{" "}
                {itemCount === 1 ? LABELS.itemSingular : LABELS.itemPlural}
              </>
            )}
          </p>
          <OrderStatusGroup
            className="mt-4"
            orderStatus={order.status}
            paymentStatus={order.paymentStatus}
          />
        </div>
      </div>
    </header>
  );
}
