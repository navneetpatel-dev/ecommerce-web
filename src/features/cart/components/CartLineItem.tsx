"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { UNAVAILABLE_REASON } from "@/shared/constants/statuses";
import { QuantitySelector } from "@/shared/components/QuantitySelector";
import { MediaImage } from "@/shared/components/MediaImage";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { MAX_CART_LINE_QUANTITY } from "@/shared/constants/cart";
import { cn } from "@/shared/utils/cn";
import { formatLabel } from "@/shared/utils/formatLabel";
import type { CartItem } from "@/shared/api/types";
import type { UnavailableReason } from "@/shared/constants/statuses";
import { formatInrAmount } from "@/shared/utils/orderFormat";

function unavailableLabel(
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

function variantLabel(item: CartItem) {
  return Object.values(item.variant?.attributes || {})
    .filter(Boolean)
    .join(" · ");
}

interface CartLineItemProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  /** Compact layout used inside CartDrawer */
  compact?: boolean;
}

export function CartLineItem({
  item,
  onUpdateQuantity,
  onRemoveItem,
  compact = false,
}: CartLineItemProps) {
  const available = item.isAvailable !== false;
  const attrs = variantLabel(item);
  const lineTotal = Number(item.product.price) * item.quantity;

  if (compact) {
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
            className="truncate text-[0.8125rem] font-medium leading-snug text-ink hover:text-brand"
          >
            {item.product.name}
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onRemoveItem(item.id)}
            className="h-8 w-8 min-h-8 max-h-8 shrink-0 justify-self-end p-0 text-ink-muted hover:bg-danger-subtle hover:text-danger"
            aria-label={formatLabel(LABELS.removeNamed, {
              name: item.product.name,
            })}
          >
            <Trash2 size={14} />
          </Button>
          {!available ? (
            <Badge variant="destructive" className="w-fit text-[0.6875rem]">
              {unavailableLabel(item.unavailableReason)}
            </Badge>
          ) : (
            <p className="truncate text-[0.8125rem] font-semibold tabular-nums text-brand">
              ₹{formatInrAmount(item.product.price)}
            </p>
          )}
          {available ? (
            <QuantitySelector
              value={item.quantity}
              onChange={(quantity) => onUpdateQuantity(item.id, quantity)}
              min={1}
              max={MAX_CART_LINE_QUANTITY}
              controlClassName="h-8 w-8 min-h-8 max-h-8 [&_svg]:size-3.5"
              valueClassName="h-4 w-5 text-[0.8125rem]"
            />
          ) : (
            <span />
          )}
        </div>
      </div>
    );
  }

  return (
    <li
      className={cn(
        "group grid grid-cols-[4.5rem_1fr] gap-3 py-3.5 sm:grid-cols-[5.5rem_1fr_auto] sm:gap-4",
        !available && "opacity-50 grayscale",
      )}
    >
      <Link
        href={PATHS.product(item.product.slug)}
        className="relative aspect-square overflow-hidden bg-paper"
        tabIndex={available ? undefined : -1}
      >
        <Image
          src={item.product.imageUrl}
          alt={item.product.name}
          fill
          sizes="88px"
          className="object-cover transition-transform duration-[var(--motion-moderate)] group-hover:scale-[1.03]"
        />
      </Link>

      <div className="min-w-0 flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={PATHS.product(item.product.slug)}
              className="block text-[0.9375rem] font-medium leading-snug text-ink transition-colors hover:text-brand"
            >
              {item.product.name}
            </Link>
            {attrs ? (
              <p className="mt-0.5 font-mono text-[0.6875rem] tracking-wide text-ink-muted">
                {attrs}
              </p>
            ) : null}
            {!available ? (
              <Badge variant="destructive" className="mt-1 text-[0.6875rem]">
                {unavailableLabel(item.unavailableReason)}
              </Badge>
            ) : (
              <p className="mt-1 text-[0.8125rem] text-ink-muted sm:hidden">
                ₹{formatInrAmount(Number(item.product.price))} each
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-9 w-9 min-h-9 max-h-9 shrink-0 text-ink-muted hover:bg-danger-subtle hover:text-danger sm:hidden"
            aria-label={formatLabel(LABELS.removeNamed, {
              name: item.product.name,
            })}
            onClick={() => onRemoveItem(item.id)}
          >
            <Trash2 size={15} />
          </Button>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-3">
          {available ? (
            <QuantitySelector
              value={item.quantity}
              onChange={(quantity) => onUpdateQuantity(item.id, quantity)}
              min={1}
              max={MAX_CART_LINE_QUANTITY}
              controlClassName="h-8 w-8 min-h-8 max-h-8 sm:h-9 sm:w-9 sm:min-h-9 sm:max-h-9 lg:h-10 lg:w-10 lg:min-h-10 lg:max-h-10"
              valueClassName="h-4 w-5 text-[0.75rem] sm:h-5 sm:w-6 sm:text-[0.8125rem]"
            />
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="hidden h-auto min-h-0 max-h-none items-center gap-1.5 px-0 py-0 text-[0.8125rem] text-ink-muted hover:bg-transparent hover:text-danger sm:inline-flex"
            onClick={() => onRemoveItem(item.id)}
          >
            <Trash2 size={14} />
            {LABELS.remove}
          </Button>
        </div>
      </div>

      {available ? (
        <div className="hidden flex-col items-end justify-start gap-1 pt-0.5 sm:flex">
          <p className="font-display text-[1.125rem] tabular-nums text-ink">
            ₹{formatInrAmount(lineTotal)}
          </p>
          <p className="text-[0.75rem] text-ink-muted">
            ₹{formatInrAmount(Number(item.product.price))} each
          </p>
        </div>
      ) : (
        <div className="hidden sm:block" />
      )}
    </li>
  );
}
