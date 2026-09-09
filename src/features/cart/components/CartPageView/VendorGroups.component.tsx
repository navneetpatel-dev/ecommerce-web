"use client";

import { ContinueShoppingLink } from "@/shared/components/ContinueShoppingLink.component";
import type { CartItem } from "@/shared/api/types";
import { VendorGroupCard } from "./VendorGroupCard.component";
import { vendorGroupsStyles as styles } from "./vendorGroups.styles";

interface VendorGroupsProps {
  groupedByVendor: Record<string, CartItem[]>;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  disabled?: boolean;
}

export function VendorGroups({
  groupedByVendor,
  onUpdateQuantity,
  onRemoveItem,
  disabled = false,
}: VendorGroupsProps) {
  const vendorEntries = Object.entries(groupedByVendor);

  return (
    <>
      <div className={styles.container}>
        {vendorEntries.map(([vendorId, items], vendorIndex) => (
          <VendorGroupCard
            key={vendorId}
            vendorId={vendorId}
            items={items}
            vendorIndex={vendorIndex}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
            disabled={disabled}
          />
        ))}
      </div>

      <div className={styles.footerWrapper}>
        <ContinueShoppingLink />
      </div>
    </>
  );
}
