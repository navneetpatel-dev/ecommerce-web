import { MediaImage } from "@/shared/components/MediaImage.component";
import { VendorStrip } from "@/shared/components/VendorStrip.component";
import { MoneyAmount } from "@/shared/components/MoneyAmount.component";
import type { CartItem, CheckoutQuote } from "@/shared/api/types";
import { resolveCartLineSubtotal } from "../../utils/checkoutDisplay.utils";

interface OrderSummaryItemsListProps {
  groupedByVendor: Record<string, CartItem[]>;
  quote?: CheckoutQuote | null;
  amountsUnavailable?: boolean;
}

/** Per-vendor line-item list inside the checkout order summary (Rule 3). */
export function OrderSummaryItemsList({
  groupedByVendor,
  quote,
  amountsUnavailable = false,
}: OrderSummaryItemsListProps) {
  return (
    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-4 md:px-6">
      {Object.entries(groupedByVendor).map(([vendorId, vendorItems]) => (
        <div key={vendorId}>
          <VendorStrip vendor={vendorItems[0]?.product?.vendor} size="sm" />
          <ul className="mt-3 space-y-3">
            {vendorItems.map((item) => (
              <li key={item.id} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm border border-line bg-paper">
                  <MediaImage
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    imageClassName="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.875rem] font-medium text-ink">
                    {item.product.name}
                  </p>
                  <p className="mt-0.5 text-[0.75rem] text-ink-muted">
                    Qty {item.quantity}
                  </p>
                </div>
                <p className="shrink-0 text-[0.875rem] tabular-nums text-ink">
                  <MoneyAmount
                    value={resolveCartLineSubtotal(item, quote)}
                    unavailable={amountsUnavailable}
                  />
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
