"use client";

import { motion } from "motion/react";
import { ContinueShoppingLink } from "@/shared/components/ContinueShoppingLink.component";
import { VendorGroupHeader } from "@/shared/components/VendorGroupHeader.component";
import { VENDOR_GROUP_CARD } from "@/shared/components/vendorGroupStyles";
import { CartLineItem } from "../CartLineItem.component";
import type { CartItem } from "@/shared/api/types";

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
      <div className="space-y-4">
        {vendorEntries.map(([vendorId, items], vendorIndex) => {
          const vendor = items[0]?.product?.vendor;
          const vendorItemCount = items.reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0,
          );
          const vendorHeaderElement = vendor ? (
            <VendorGroupHeader
              className="mb-1"
              vendorName={vendor.businessName}
              vendorId={vendor.id}
              count={vendorItemCount}
            />
          ) : null;
          const lineItemElements = items.map((item) => (
            <CartLineItem
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
              disabled={disabled}
            />
          ));
          const sectionTransition = {
            duration: 0.3,
            delay: 0.04 * vendorIndex,
            ease: [0.2, 0, 0, 1] as const,
          };

          return (
            <motion.section
              key={vendorId}
              className={VENDOR_GROUP_CARD}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={sectionTransition}
            >
              {vendorHeaderElement}

              <ul className="divide-y divide-line">{lineItemElements}</ul>
            </motion.section>
          );
        })}
      </div>

      <div className="mt-6 border-t border-line pt-4">
        <ContinueShoppingLink />
      </div>
    </>
  );
}
