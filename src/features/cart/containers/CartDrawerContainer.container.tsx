"use client";

import { useCartDrawer } from "../hooks/useCartDrawer.hook";
import { CartDrawer } from "../components/CartDrawer.component";

export function CartDrawerContainer() {
  const drawer = useCartDrawer();

  return (
    <CartDrawer
      isOpen={drawer.isOpen}
      onClose={drawer.close}
      isLoading={drawer.isLoading}
      hasItems={drawer.hasItems}
      groupedByVendor={drawer.groupedByVendor}
      total={drawer.total}
      totalIsEstimated={drawer.totalIsEstimated}
      hasUnavailableItems={drawer.hasUnavailableItems}
      onContinueShopping={drawer.continueShopping}
      onUpdateQuantity={drawer.updateQuantity}
      onRemoveItem={drawer.removeItem}
    />
  );
}
