"use client";

import Link from "next/link";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { QuantitySelector } from "@/shared/components/QuantitySelector.component";
import { InlineAmountSkeleton } from "@/shared/components/InlineAmountSkeleton.component";
import { MediaImage } from "@/shared/components/MediaImage.component";
import { Badge } from "@/shared/components/ui/badge";
import { MAX_CART_LINE_QUANTITY } from "@/shared/constants/cart";
import { cn } from "@/shared/utils/cn";
import { formatInrAmount } from "@/shared/utils/orderFormat";
import type { CartItem } from "@/shared/api/types";
import {
  eachPriceCopy,
  unavailableLabel,
  variantLabel,
} from "./cartLineShared.component";
import {
  hasPendingCartLineSubtotal,
  resolveCartLineDisplaySubtotal,
} from "@/features/cart/utils/cartDisplay.utils";
import { RemoveCartItemAction } from "../RemoveCartItemAction.component";

interface FullCartLineProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  disabled?: boolean;
}

/** Full-width cart row rendered on the cart page (Rule 3 split). */
export function FullCartLine(props: FullCartLineProps) {
  const { item, onUpdateQuantity, onRemoveItem, disabled = false } = props;
  const available = item.isAvailable !== false;
  const attrs = variantLabel(item);
  const linePending = hasPendingCartLineSubtotal(item);
  const lineTotal = resolveCartLineDisplaySubtotal(item);
  const mobileEachPrice = `${eachPriceCopy(item)}`;
  const imageLinkTabIndex = available ? undefined : -1;

  const handleQuantityChange = (quantity: number) => {
    onUpdateQuantity(item.id, quantity);
  };

  const rootClassName = cn(
    "group grid grid-cols-[4.5rem_1fr] gap-3 py-3.5 sm:grid-cols-[5.5rem_1fr_auto] sm:gap-4",
    !available && "opacity-50 grayscale",
  );

  const attrsElement = attrs ? (
    <p className="mt-0.5 font-mono text-[0.6875rem] tracking-wide text-ink-muted">
      {attrs}
    </p>
  ) : null;

  const availabilityElement = available ? (
    <p className="mt-1 text-body-sm text-ink-muted sm:hidden">
      ₹{formatInrAmount(Number(item.product.price))} {LABELS.each}
    </p>
  ) : (
    <Badge variant="destructive" className="mt-1 text-[0.6875rem]">
      {unavailableLabel(item.unavailableReason)}
    </Badge>
  );

  const quantityElement = available ? (
    <QuantitySelector
      value={item.quantity}
      onChange={handleQuantityChange}
      min={1}
      max={item.maxQuantity ?? MAX_CART_LINE_QUANTITY}
      disabled={disabled}
      disabledHint={LABELS.cartUpdatingActionHint}
      controlClassName="h-8 w-8 min-h-8 max-h-8 sm:h-9 sm:w-9 sm:min-h-9 sm:max-h-9 lg:h-10 lg:w-10 lg:min-h-10 lg:max-h-10"
      valueClassName="h-4 w-5 text-[0.75rem] sm:h-5 sm:w-6 sm:text-body-sm"
    />
  ) : null;

  const lineAmountElement =
    linePending || lineTotal == null ? (
      <InlineAmountSkeleton className="h-4 w-20" />
    ) : (
      <p className="font-display text-[1.125rem] tabular-nums text-ink">
        ₹{formatInrAmount(lineTotal)}
      </p>
    );

  const amountSectionElement = available ? (
    <div className="hidden flex-col items-end justify-start gap-1 pt-0.5 sm:flex">
      {lineAmountElement}
      <p className="text-[0.75rem] text-ink-muted">{mobileEachPrice}</p>
    </div>
  ) : (
    <div className="hidden sm:block" />
  );

  return (
    <li className={rootClassName}>
      <Link
        href={PATHS.product(item.product.slug)}
        className="relative aspect-square self-end overflow-hidden rounded-sm border border-line bg-paper"
        tabIndex={imageLinkTabIndex}
      >
        <MediaImage
          src={item.product.imageUrl}
          alt={item.product.name}
          sizes="88px"
          imageClassName="object-cover transition-transform duration-[var(--motion-moderate)] group-hover:scale-[1.03]"
        />
      </Link>

      <div className="min-w-0 flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={PATHS.product(item.product.slug)}
              className="block text-body font-medium leading-snug text-ink transition-colors hover:text-brand"
            >
              {item.product.name}
            </Link>
            {attrsElement}
            {availabilityElement}
          </div>
          <RemoveCartItemAction
            item={item}
            className="h-9 w-9 min-h-9 max-h-9 shrink-0 text-ink-muted hover:bg-danger-subtle hover:text-danger sm:hidden"
            disabled={disabled}
            onRemoveItem={onRemoveItem}
          />
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-3">
          {quantityElement}
          <RemoveCartItemAction
            item={item}
            display="label"
            className="hidden h-auto min-h-0 max-h-none items-center gap-1.5 px-0 py-0 text-body-sm text-ink-muted hover:bg-transparent hover:text-danger sm:inline-flex"
            disabled={disabled}
            onRemoveItem={onRemoveItem}
          />
        </div>
      </div>

      {amountSectionElement}
    </li>
  );
}
