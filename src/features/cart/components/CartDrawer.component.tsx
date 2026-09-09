"use client";

import { X, ShoppingBag } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useBodyScrollLock } from "@/shared/hooks/useBodyScrollLock.hook";
import { CartDrawerSummary } from "./CartDrawerSummary.component";
import { CartDrawerVendorGroupsList } from "./CartDrawerVendorGroupsList.component";
import { ClearCartAction } from "./CartPageView/ClearCartAction.component";
import type { CartItem } from "@/shared/api/types";
import { cartDrawerStyles as styles } from "./cartDrawer.styles";

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

  let bodyContent;
  if (isLoading) {
    bodyContent = (
      <div className={styles.skeletonContainer}>
        <Skeleton className={styles.skeletonItem} />
        <Skeleton className={styles.skeletonItem} />
        <Skeleton className={styles.skeletonItem} />
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
      <CartDrawerVendorGroupsList
        groupedByVendor={groupedByVendor}
        amountsUnavailable={amountsUnavailable}
        disabled={isCartMutating}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
      />
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
        className={styles.backdrop}
        onClick={onClose}
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className={styles.drawer}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{LABELS.yourCart}</h2>
          <div className={styles.headerActions}>
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

        <div className={styles.scrollArea}>{bodyContent}</div>

        {summaryElement}
      </motion.aside>
    </>
  ) : null;

  return <AnimatePresence>{drawerElement}</AnimatePresence>;
}
