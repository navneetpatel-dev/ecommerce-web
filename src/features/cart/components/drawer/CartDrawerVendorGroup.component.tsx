import { VendorStrip } from "@/shared/components/VendorStrip.component";
import type { CartItem } from "@/shared/api/types";
import { CartLineItem } from "../line-item/CartLineItem.component";
import { cartDrawerStyles as styles } from "../../styles/drawer/cartDrawer.styles";

interface CartDrawerVendorGroupProps {
  items: CartItem[];
  amountsUnavailable?: boolean;
  disabled?: boolean;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export function CartDrawerVendorGroup({
  items,
  amountsUnavailable,
  disabled,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerVendorGroupProps) {
  if (items.length === 0) return null;

  return (
    <div className={styles.vendorGroup}>
      <VendorStrip vendor={items[0].product.vendor} size="sm" />
      {items.map((item) => (
        <CartLineItem
          key={item.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
          compact
          amountsUnavailable={amountsUnavailable}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
