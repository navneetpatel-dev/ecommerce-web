'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { PATHS } from '@/shared/constants/paths'
import { LABELS } from '@/shared/constants/labels'
import { UNAVAILABLE_REASON } from '@/shared/constants/statuses'
import { QuantitySelector } from '@/shared/components/QuantitySelector'
import { Badge } from '@/shared/components/ui/badge'
import { MAX_CART_LINE_QUANTITY } from '@/shared/constants/cart'
import { cn } from '@/shared/utils/cn'
import type { CartItem } from '@/shared/api/types'
import type { UnavailableReason } from '@/shared/constants/statuses'

function unavailableLabel(reason: UnavailableReason | null | undefined): string {
  switch (reason) {
    case UNAVAILABLE_REASON.OUT_OF_STOCK:
      return LABELS.unavailableReasonOutOfStock
    case UNAVAILABLE_REASON.PRODUCT_UNPUBLISHED:
      return LABELS.unavailableReasonProductUnpublished
    case UNAVAILABLE_REASON.VENDOR_UNAVAILABLE:
      return LABELS.unavailableReasonVendorUnavailable
    default:
      return LABELS.unavailableGeneric
  }
}

function variantLabel(item: CartItem) {
  return Object.values(item.variant?.attributes || {}).filter(Boolean).join(' · ')
}

interface CartLineItemProps {
  item: CartItem
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  /** Compact layout used inside CartDrawer */
  compact?: boolean
}

export function CartLineItem({ item, onUpdateQuantity, onRemoveItem, compact = false }: CartLineItemProps) {
  const available = item.isAvailable !== false
  const attrs = variantLabel(item)
  const lineTotal = Number(item.product.price) * item.quantity

  if (compact) {
    return (
      <div
        className={cn(
          'flex gap-3 pb-3 border-b border-line last:border-0',
          !available && 'opacity-50 grayscale'
        )}
      >
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          className="h-16 w-16 rounded-sm object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <Link
            href={PATHS.product(item.product.slug)}
            className="text-[0.9375rem] font-medium line-clamp-2 hover:text-brand"
          >
            {item.product.name}
          </Link>
          {!available ? (
            <Badge variant="destructive" className="mt-1 text-[0.6875rem]">
              {unavailableLabel(item.unavailableReason)}
            </Badge>
          ) : (
            <p className="font-sans text-[0.9375rem] font-semibold text-brand mt-0.5">
              ₹{item.product.price.toLocaleString('en-IN')}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1">
            {available ? (
              <QuantitySelector
                value={item.quantity}
                onChange={(quantity) => onUpdateQuantity(item.id, quantity)}
                min={1}
                max={MAX_CART_LINE_QUANTITY}
              />
            ) : null}
            <button
              onClick={() => onRemoveItem(item.id)}
              className="p-0.5 hover:bg-paper rounded ml-auto"
              aria-label={`Remove ${item.product.name}`}
            >
              <Trash2 size={14} className="text-ink-muted" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <li
      className={cn(
        'group grid grid-cols-[4.5rem_1fr] gap-3 py-3.5 sm:grid-cols-[5.5rem_1fr_auto] sm:gap-4',
        !available && 'opacity-50 grayscale'
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
                ₹{Number(item.product.price).toLocaleString('en-IN')} each
              </p>
            )}
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-danger-subtle hover:text-danger sm:hidden"
            aria-label={`Remove ${item.product.name}`}
            onClick={() => onRemoveItem(item.id)}
          >
            <Trash2 size={15} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {available ? (
            <QuantitySelector
              value={item.quantity}
              onChange={(quantity) => onUpdateQuantity(item.id, quantity)}
              min={1}
              max={MAX_CART_LINE_QUANTITY}
            />
          ) : null}
          <button
            type="button"
            className="hidden items-center gap-1.5 text-[0.8125rem] text-ink-muted transition-colors hover:text-danger sm:inline-flex"
            onClick={() => onRemoveItem(item.id)}
          >
            <Trash2 size={14} />
            Remove
          </button>
        </div>
      </div>

      {available ? (
        <div className="hidden flex-col items-end justify-start gap-1 pt-0.5 sm:flex">
          <p className="font-display text-[1.125rem] tabular-nums text-ink">
            ₹{lineTotal.toLocaleString('en-IN')}
          </p>
          <p className="text-[0.75rem] text-ink-muted">
            ₹{Number(item.product.price).toLocaleString('en-IN')} each
          </p>
        </div>
      ) : (
        <div className="hidden sm:block" />
      )}
    </li>
  )
}
