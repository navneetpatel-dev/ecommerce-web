import { VendorStrip } from "@/shared/components/VendorStrip.component";
import { formatInr } from "../utils/format";
import type { Order } from "@/shared/api/types";

interface OrderConfirmationItemsProps {
  order: Pick<Order, "subOrders">;
}

/**
 * What was actually ordered, grouped by vendor.
 *
 * Quantities and line totals are the frozen values the backend persisted with
 * the order — never recomputed here.
 */
export function OrderConfirmationItems({ order }: OrderConfirmationItemsProps) {
  const subOrders = order.subOrders ?? [];
  if (subOrders.length === 0) return null;

  return (
    <div className="space-y-4">
      {subOrders.map((subOrder) => (
        <div key={subOrder.id} className="space-y-2">
          <VendorStrip vendor={subOrder.vendor} size="sm" />
          <ul className="space-y-1.5">
            {(subOrder.items ?? []).map((item) => (
              <li
                key={item.id}
                className="flex items-baseline justify-between gap-3 text-[0.875rem]"
              >
                <span className="min-w-0 text-ink">
                  <span className="line-clamp-2">{item.productName}</span>
                  <span className="text-ink-muted"> × {item.quantity}</span>
                </span>
                <span className="shrink-0 tabular-nums text-ink">
                  {formatInr(item.lineTotal)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
