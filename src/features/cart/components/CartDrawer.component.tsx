"use client";

import { X, ShoppingBag } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { motion, AnimatePresence } from "motion/react";
import { VendorStrip } from "@/shared/components/VendorStrip.component";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useBodyScrollLock } from "@/shared/hooks/useBodyScrollLock.hook";
import { CartLineItem } from "./CartLineItem.component";
import { CartDrawerSummary } from "./CartDrawerSummary.component";
import { ClearCartAction } from "./CartPageView/ClearCartAction.component";
import type { CartItem } from "@/shared/api/types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  hasItems: boolean;
  groupedByVendor: Record<string, CartItem[]>;
  total: number | undefined;
  totalIsEstimated?: boolean;
  pendingLineTotals?: boolean;
  totalsFetching?: boolean;
  isCartMutating?: boolean;
  mutationError?: string | null;
  onDismissMutationError?: () => void;
  /** Cart request failed — amounts are missing for good, not mid-refresh. */
  amountsUnavailable?: boolean;
  onRetryAmounts?: () => void;
  pricingPreview?: {
    merchandiseSubtotal: number;
    taxTotal: number;
    shippingTotal: number;
    shippingDisplayKey: "FREE" | "PAID";
  };
  hasUnavailableItems?: boolean;
  onContinueShopping: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  isClearing?: boolean;
}

export function CartDrawer({
  isOpen,
  onClose,
  isLoading,
  hasItems,
  groupedByVendor,
  total,
  totalIsEstimated = false,
  pendingLineTotals = false,
  totalsFetching = false,
  isCartMutating = false,
  mutationError = null,
  onDismissMutationError,
  amountsUnavailable = false,
  onRetryAmounts,
  pricingPreview,
  hasUnavailableItems,
  onContinueShopping,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  isClearing = false,
}: CartDrawerProps) {
  useBodyScrollLock(isOpen);

  const clearCartActionElement = hasItems ? (
    <ClearCartAction
      onClear={onClearCart}
      isClearing={isClearing}
      disabled={isCartMutating && !isClearing}
    />
  ) : null;

  const vendorGroupElements = Object.entries(groupedByVendor).map(
    ([vendorId, items]) => {
      const lineItemElements = items.map((item) => (
        <CartLineItem
          key={item.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
          compact
          amountsUnavailable={amountsUnavailable}
          disabled={isCartMutating}
        />
      ));

      return (
        <div key={vendorId} className="space-y-1 py-3 first:pt-0 last:pb-0">
          <VendorStrip vendor={items[0].product.vendor} size="sm" />
          {lineItemElements}
        </div>
      );
    },
  );

  let bodyContent;
  if (isLoading) {
    bodyContent = (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full rounded-md" />
        <Skeleton className="h-20 w-full rounded-md" />
        <Skeleton className="h-20 w-full rounded-md" />
      </div>
    );
  } else if (!hasItems) {
    bodyContent = (
      <EmptyState
        heading={LABELS.cartEmptyHeading}
        message={LABELS.cartEmptyMessage}
        icon={ShoppingBag}
        actionLabel={LABELS.continueShopping}
        onAction={onContinueShopping}
      />
    );
  } else {
    bodyContent = (
      <div className="divide-y divide-line">{vendorGroupElements}</div>
    );
  }

  const summaryElement = hasItems ? (
    <CartDrawerSummary
      pricingPreview={pricingPreview}
      total={total}
      totalIsEstimated={totalIsEstimated}
      pendingLineTotals={pendingLineTotals}
      totalsFetching={totalsFetching}
      isCartMutating={isCartMutating}
      mutationError={mutationError}
      onDismissMutationError={onDismissMutationError}
      amountsUnavailable={amountsUnavailable}
      onRetryAmounts={onRetryAmounts}
      hasUnavailableItems={hasUnavailableItems}
      onClose={onClose}
    />
  ) : null;

  const drawerElement = isOpen ? (
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
          <h2 className="text-[1.125rem] font-semibold">{LABELS.yourCart}</h2>
          <div className="flex items-center gap-1">
            {clearCartActionElement}
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
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-auto overscroll-contain p-4">
          {bodyContent}
        </div>

        {summaryElement}
      </motion.aside>
    </>
  ) : null;

  return <AnimatePresence>{drawerElement}</AnimatePresence>;
}
