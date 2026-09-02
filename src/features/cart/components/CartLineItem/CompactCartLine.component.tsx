"use client";

import Link from "next/link";
import { PATHS } from "@/shared/constants/paths";
import { QuantitySelector } from "@/shared/components/QuantitySelector.component";
import { MediaImage } from "@/shared/components/MediaImage.component";
import { Badge } from "@/shared/components/ui/badge";
import { MAX_CART_LINE_QUANTITY } from "@/shared/constants/cart";
import { cn } from "@/shared/utils/cn";
import { formatInrAmount } from "@/shared/utils/orderFormat";
import type { CartItem } from "@/shared/api/types";
import {
  hasPendingCartLineSubtotal,
  resolveCartLineDisplaySubtotal,
} from "@/features/cart/utils/cartDisplay.utils";
import { RemoveLineButton, unavailableLabel } from "./cartLineShared.component";

interface CompactCartLineProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

/** Compact cart row rendered inside the slide-over drawer (Rule 3 split). */
export function CompactCartLine(props: CompactCartLineProps) {
  const { item, onUpdateQuantity, onRemoveItem } = props;
  const available = item.isAvailable !== false;
  const linePending = hasPendingCartLineSubtotal(item);
  const lineTotal = resolveCartLineDisplaySubtotal(item);

  const handleQuantityChange = (quantity: number) => {
    onUpdateQuantity(item.id, quantity);
  };

  const removeButtonClassName =
    "h-8 w-8 min-h-8 max-h-8 shrink-0 justify-self-end p-0 text-ink-muted hover:bg-danger-subtle hover:text-danger";

  return (
    <div
      className={cn(
        "flex items-center gap-3 py-2",
        !available && "opacity-50 grayscale",
      )}
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm">
        <MediaImage
          src={item.product.imageUrl}
          alt={item.product.name}
          sizes="56px"
          imageClassName="object-cover"
        />
      </div>
      <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1">
        <Link
          href={PATHS.product(item.product.slug)}
          className="truncate text-body-sm font-medium leading-snug text-ink hover:text-brand"
        >
          {item.product.name}
        </Link>
        <RemoveLineButton
          item={item}
          className={removeButtonClassName}
          onRemoveItem={onRemoveItem}
        />
        {!available ? (
          <Badge variant="destructive" className="w-fit text-[0.6875rem]">
            {unavailableLabel(item.unavailableReason)}
          </Badge>
        ) : (
          <p
            className={cn(
              "truncate text-body-sm font-semibold tabular-nums",
              linePending ? "text-ink-muted" : "text-brand",
            )}
          >
            {linePending || lineTotal == null ? (
              "Updating…"
            ) : (
              <>₹{formatInrAmount(lineTotal)}</>
            )}
          </p>
        )}
        {available ? (
          <QuantitySelector
            value={item.quantity}
            onChange={handleQuantityChange}
            min={1}
            max={MAX_CART_LINE_QUANTITY}
            controlClassName="h-8 w-8 min-h-8 max-h-8 [&_svg]:size-3.5"
            valueClassName="h-4 w-5 text-body-sm"
          />
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
