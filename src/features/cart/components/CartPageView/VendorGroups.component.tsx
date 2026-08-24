"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { motion } from "motion/react";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { CartLineItem } from "../CartLineItem.component";
import type { CartItem } from "@/shared/api/types";

interface VendorGroupsProps {
  groupedByVendor: Record<string, CartItem[]>;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export function VendorGroups({
  groupedByVendor,
  onUpdateQuantity,
  onRemoveItem,
}: VendorGroupsProps) {
  const vendorEntries = Object.entries(groupedByVendor);

  return (
    <>
      <div className="space-y-8">
        {vendorEntries.map(([vendorId, items], vendorIndex) => {
          const vendor = items[0]?.product?.vendor;
          return (
            <motion.section
              key={vendorId}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.04 * vendorIndex,
                ease: [0.2, 0, 0, 1],
              }}
            >
              {vendor && (
                <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-line pb-2">
                  <div className="flex items-baseline gap-2">
                    <TextEyebrow className="!mb-0">Sold by</TextEyebrow>
                    <Link
                      href={`${PATHS.products}?vendorId=${vendor.id}`}
                      className="font-display text-[1.125rem] text-ink transition-colors hover:text-brand"
                    >
                      {vendor.businessName}
                    </Link>
                  </div>
                  <span className="font-mono text-[0.6875rem] uppercase tracking-wider text-ink-faint">
                    {items.reduce(
                      (sum, item) => sum + Number(item.quantity || 0),
                      0,
                    )}{" "}
                    items
                  </span>
                </div>
              )}

              <ul className="divide-y divide-line">
                {items.map((item) => (
                  <CartLineItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemoveItem={onRemoveItem}
                  />
                ))}
              </ul>
            </motion.section>
          );
        })}
      </div>

      <div className="mt-6 border-t border-line pt-4">
        <Link
          href={PATHS.products}
          className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-brand transition-colors hover:text-brand-hover"
        >
          {LABELS.continueShopping}
          <ArrowRight size={15} />
        </Link>
      </div>
    </>
  );
}
