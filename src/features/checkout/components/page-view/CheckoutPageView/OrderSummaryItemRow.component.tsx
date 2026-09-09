import { memo } from "react";
import { MediaImage } from "@/shared/components/MediaImage.component";
import { MoneyAmount } from "@/shared/components/MoneyAmount.component";
import type { CartItem, CheckoutQuote } from "@/shared/api/types";
import { resolveCartLineSubtotal } from "../../../utils/checkout/checkoutDisplay.utils";
import { ORDER_SUMMARY_ITEMS_LIST_STYLES } from "./orderSummaryItemsList.styles";

interface OrderSummaryItemRowProps {
  item: CartItem;
  quote?: CheckoutQuote | null;
  amountsUnavailable?: boolean;
}

export const OrderSummaryItemRow = memo(function OrderSummaryItemRow({
  item,
  quote,
  amountsUnavailable = false,
}: OrderSummaryItemRowProps) {
  const lineSubtotal = resolveCartLineSubtotal(item, quote);

  return (
    <li className={ORDER_SUMMARY_ITEMS_LIST_STYLES.itemRow}>
      <div className={ORDER_SUMMARY_ITEMS_LIST_STYLES.imageWrapper}>
        <MediaImage
          src={item.product.imageUrl}
          alt={item.product.name}
          imageClassName="object-cover"
          sizes="56px"
        />
      </div>
      <div className={ORDER_SUMMARY_ITEMS_LIST_STYLES.itemDetails}>
        <p className={ORDER_SUMMARY_ITEMS_LIST_STYLES.itemName}>
          {item.product.name}
        </p>
        <p className={ORDER_SUMMARY_ITEMS_LIST_STYLES.itemQty}>
          Qty {item.quantity}
        </p>
      </div>
      <p className={ORDER_SUMMARY_ITEMS_LIST_STYLES.itemPrice}>
        <MoneyAmount value={lineSubtotal} unavailable={amountsUnavailable} />
      </p>
    </li>
  );
});
