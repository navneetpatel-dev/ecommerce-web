import { memo } from "react";
import { VendorStrip } from "@/shared/components/VendorStrip.component";
import type { CartItem, CheckoutQuote } from "@/shared/api/types";
import { OrderSummaryItemRow } from "./OrderSummaryItemRow.component";
import { ORDER_SUMMARY_ITEMS_LIST_STYLES } from "../../../styles/page-view/orderSummaryItemsList.styles";

interface OrderSummaryVendorGroupProps {
  vendorItems: CartItem[];
  quote?: CheckoutQuote | null;
  amountsUnavailable?: boolean;
}

export const OrderSummaryVendorGroup = memo(function OrderSummaryVendorGroup({
  vendorItems,
  quote,
  amountsUnavailable = false,
}: OrderSummaryVendorGroupProps) {
  const vendor = vendorItems[0]?.product?.vendor;

  return (
    <div>
      <VendorStrip vendor={vendor} size="sm" />
      <ul className={ORDER_SUMMARY_ITEMS_LIST_STYLES.itemsList}>
        {vendorItems.map((item) => (
          <OrderSummaryItemRow
            key={item.id}
            item={item}
            quote={quote}
            amountsUnavailable={amountsUnavailable}
          />
        ))}
      </ul>
    </div>
  );
});
