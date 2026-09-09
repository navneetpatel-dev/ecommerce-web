import type { CartItem } from "@/shared/api/types";
import { CartDrawerVendorGroup } from "./CartDrawerVendorGroup.component";
import { cartDrawerStyles as styles } from "./cartDrawer.styles";

interface CartDrawerVendorGroupsListProps {
  groupedByVendor: Record<string, CartItem[]>;
  amountsUnavailable?: boolean;
  disabled?: boolean;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export function CartDrawerVendorGroupsList({
  groupedByVendor,
  amountsUnavailable,
  disabled,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerVendorGroupsListProps) {
  return (
    <div className={styles.vendorGroupsList}>
      {Object.entries(groupedByVendor).map(([vendorId, items]) => (
        <CartDrawerVendorGroup
          key={vendorId}
          items={items}
          amountsUnavailable={amountsUnavailable}
          disabled={disabled}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  );
}
