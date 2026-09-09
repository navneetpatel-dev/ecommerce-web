import { motion } from "motion/react";
import { VendorGroupHeader } from "@/shared/components/VendorGroupHeader.component";
import type { CartItem } from "@/shared/api/types";
import { CartLineItem } from "../../line-item/CartLineItem.component";
import { vendorGroupsStyles as styles } from "../../../styles/page/vendorGroups.styles";

interface VendorGroupCardProps {
  vendorId: string;
  items: CartItem[];
  vendorIndex: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  disabled?: boolean;
}

export function VendorGroupCard({
  items,
  vendorIndex,
  onUpdateQuantity,
  onRemoveItem,
  disabled = false,
}: VendorGroupCardProps) {
  const vendor = items[0]?.product?.vendor;
  const vendorItemCount = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );

  const sectionTransition = {
    duration: 0.3,
    delay: 0.04 * vendorIndex,
    ease: [0.2, 0, 0, 1] as const,
  };

  return (
    <motion.section
      className={styles.groupCard}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={sectionTransition}
    >
      {vendor && (
        <VendorGroupHeader
          className={styles.header}
          vendorName={vendor.businessName}
          vendorId={vendor.id}
          count={vendorItemCount}
        />
      )}

      <ul className={styles.itemsList}>
        {items.map((item) => (
          <CartLineItem
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
            disabled={disabled}
          />
        ))}
      </ul>
    </motion.section>
  );
}
