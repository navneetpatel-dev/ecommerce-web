"use client";

import type { CartItem } from "@/shared/api/types";
import { CompactCartLine } from "./CartLineItem/CompactCartLine";
import { FullCartLine } from "./CartLineItem/FullCartLine";

export interface CartLineItemProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  /** Compact layout used inside CartDrawer */
  compact?: boolean;
}

/**
 * Cart line row; dispatches to the compact (drawer) or full (page) layout.
 * Shared helpers live in CartLineItem/cartLineShared (Rule 2/3).
 */
export function CartLineItem(props: CartLineItemProps) {
  const { item, onUpdateQuantity, onRemoveItem, compact = false } = props;

  if (compact) {
    return (
      <CompactCartLine
        item={item}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
      />
    );
  }

  return (
    <FullCartLine
      item={item}
      onUpdateQuantity={onUpdateQuantity}
      onRemoveItem={onRemoveItem}
    />
  );
}
