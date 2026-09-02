import { Trash2 } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import {
  UNAVAILABLE_REASON,
  type UnavailableReason,
} from "@/shared/constants/statuses";
import { Button } from "@/shared/components/ui/button";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInrAmount } from "@/shared/utils/orderFormat";
import type { CartItem } from "@/shared/api/types";

/** Maps an unavailability reason to its localized label. */
export function unavailableLabel(
  reason: UnavailableReason | null | undefined,
): string {
  switch (reason) {
    case UNAVAILABLE_REASON.OUT_OF_STOCK:
      return LABELS.unavailableReasonOutOfStock;
    case UNAVAILABLE_REASON.PRODUCT_UNPUBLISHED:
      return LABELS.unavailableReasonProductUnpublished;
    case UNAVAILABLE_REASON.VENDOR_UNAVAILABLE:
      return LABELS.unavailableReasonVendorUnavailable;
    default:
      return LABELS.unavailableGeneric;
  }
}

/** Joins selected variant attributes for display. */
export function variantLabel(item: CartItem) {
  return Object.values(item.variant?.attributes || {})
    .filter(Boolean)
    .join(" · ");
}

/** "₹X each" copy used in both cart line layouts. */
export function eachPriceCopy(item: CartItem) {
  return `₹${formatInrAmount(Number(item.product.price))} ${LABELS.each}`;
}

interface RemoveLineButtonProps {
  item: CartItem;
  className: string;
  onRemoveItem: (itemId: string) => void;
  disabled?: boolean;
}

/** Icon button that removes a cart line, with accessible name from copy. */
export function RemoveLineButton({
  item,
  className,
  onRemoveItem,
  disabled = false,
}: RemoveLineButtonProps) {
  const handleRemove = () => {
    onRemoveItem(item.id);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={handleRemove}
      className={className}
      aria-label={formatLabel(LABELS.removeNamed, {
        name: item.product.name,
      })}
      disabled={disabled}
    >
      <Trash2 size={14} />
    </Button>
  );
}
