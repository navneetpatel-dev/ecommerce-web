"use client";

import { Trash2 } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import type { CartItem } from "@/shared/api/types";
import { CartConfirmAction } from "./CartConfirmAction.component";

interface RemoveCartItemActionProps {
  item: CartItem;
  onRemoveItem: (itemId: string) => void;
  disabled?: boolean;
  display?: "icon" | "label";
  className?: string;
}

export function RemoveCartItemAction({
  item,
  onRemoveItem,
  disabled = false,
  display = "icon",
  className,
}: RemoveCartItemActionProps) {
  const handleConfirm = () => {
    onRemoveItem(item.id);
  };

  const accessibleLabel = formatLabel(LABELS.removeNamed, {
    name: item.product.name,
  });

  return (
    <CartConfirmAction
      triggerLabel={LABELS.remove}
      triggerAriaLabel={display === "icon" ? accessibleLabel : undefined}
      title={LABELS.removeCartItemTitle}
      description={formatLabel(LABELS.removeCartItemDescription, {
        name: item.product.name,
      })}
      confirmLabel={LABELS.remove}
      icon={Trash2}
      iconOnly={display === "icon"}
      triggerSize={display === "icon" ? "icon-sm" : "sm"}
      triggerClassName={className}
      disabled={disabled}
      onConfirm={handleConfirm}
    />
  );
}
