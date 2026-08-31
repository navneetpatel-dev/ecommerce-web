"use client";

import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { motion, AnimatePresence } from "motion/react";
import { VendorStrip } from "@/shared/components/VendorStrip.component";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useBodyScrollLock } from "@/shared/hooks/useBodyScrollLock.hook";
import { CartLineItem } from "./CartLineItem.component";
import type { CartItem } from "@/shared/api/types";
import { formatInrAmount } from "@/shared/utils/orderFormat";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  hasItems: boolean;
  groupedByVendor: Record<string, CartItem[]>;
  total: number;
  totalIsEstimated?: boolean;
  hasUnavailableItems?: boolean;
  onContinueShopping: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  isLoading,
  hasItems,
  groupedByVendor,
  total,
  totalIsEstimated = false,
  hasUnavailableItems,
  onContinueShopping,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  useBodyScrollLock(isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-overlay z-50"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 z-50 flex h-full w-[min(100vw,24rem)] flex-col overflow-hidden border-l border-line bg-surface-raised shadow-elevation-4 overscroll-contain"
          >
            <div className="flex items-center justify-between px-4 h-14 border-b border-line shrink-0">
              <h2 className="text-[1.125rem] font-semibold">
                {LABELS.yourCart}
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={onClose}
                aria-label={LABELS.closeCart}
              >
                <X size={20} />
              </Button>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-auto overscroll-contain p-4">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full rounded-md" />
                  <Skeleton className="h-20 w-full rounded-md" />
                  <Skeleton className="h-20 w-full rounded-md" />
                </div>
              ) : !hasItems ? (
                <EmptyState
                  heading={LABELS.cartEmptyHeading}
                  message={LABELS.cartEmptyMessage}
                  icon={ShoppingBag}
                  actionLabel={LABELS.continueShopping}
                  onAction={onContinueShopping}
                />
              ) : (
                <div className="divide-y divide-line">
                  {Object.entries(groupedByVendor).map(([vendorId, items]) => (
                    <div
                      key={vendorId}
                      className="space-y-1 py-3 first:pt-0 last:pb-0"
                    >
                      <VendorStrip vendor={items[0].product.vendor} size="sm" />
                      {items.map((item) => (
                        <CartLineItem
                          key={item.id}
                          item={item}
                          onUpdateQuantity={onUpdateQuantity}
                          onRemoveItem={onRemoveItem}
                          compact
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {hasItems ? (
              <div className="shrink-0 space-y-3 border-t border-line p-4">
                <div className="flex justify-between items-center">
                  <span className="text-body font-medium">
                    {totalIsEstimated ? "Estimated total" : LABELS.total}
                  </span>
                  <span className="text-[1.125rem] font-bold text-brand">
                    ₹{formatInrAmount(total)}
                  </span>
                </div>
                {hasUnavailableItems ? (
                  <p className="rounded-sm bg-warning-subtle px-3 py-2 text-body-sm text-warning-foreground">
                    {LABELS.removeUnavailableToCheckout}
                  </p>
                ) : (
                  <Button asChild size="lg" className="w-full">
                    <Link href={PATHS.checkout} onClick={onClose}>
                      {LABELS.checkout}
                    </Link>
                  </Button>
                )}
                <Link
                  href={PATHS.cart}
                  onClick={onClose}
                  className="block text-center text-body-sm text-brand hover:underline"
                >
                  {LABELS.viewFullCart}
                </Link>
              </div>
            ) : null}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
