"use client";

import type { CartItem } from "@/shared/api/types";
import { CompactCartLine } from "./CartLineItem/CompactCartLine.component";
import { FullCartLine } from "./CartLineItem/FullCartLine.component";

export interface CartLineItemProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  /** Compact layout used inside CartDrawer */
  compact?: boolean;
  /** Cart request failed — amounts are missing for good, not mid-refresh. */
  amountsUnavailable?: boolean;
  disabled?: boolean;
}

/**
 * Cart line row; dispatches to the compact (drawer) or full (page) layout.
 * Shared helpers live in CartLineItem/cartLineShared (Rule 2/3).
 */
export function CartLineItem(props: CartLineItemProps) {
  const {
    item,
    onUpdateQuantity,
    onRemoveItem,
    compact = false,
    amountsUnavailable = false,
    disabled = false,
  } = props;

  if (compact) {
    return (
      <CompactCartLine
        item={item}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        amountsUnavailable={amountsUnavailable}
        disabled={disabled}
      />
    );
  }

  return (
    <FullCartLine
      item={item}
      onUpdateQuantity={onUpdateQuantity}
      onRemoveItem={onRemoveItem}
      disabled={disabled}
    />
  );
}
