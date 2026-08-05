'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, ShoppingBag } from 'lucide-react'
import { EmptyState } from '@/shared/components/EmptyState'
import { VendorStrip } from '@/shared/components/VendorStrip'
import { QuantitySelector } from '@/shared/components/QuantitySelector'
import { Button } from '@/shared/components/ui/button'
import { CartPageSkeleton } from '@/shared/components/Skeletons'
import type { CartItem } from '@/shared/api/types'

interface CartPageViewProps {
  isLoading?: boolean
  hasItems: boolean
  groupedByVendor: Record<string, CartItem[]>
  total: number
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
}

export function CartPageView({
  isLoading,
  hasItems,
  groupedByVendor,
  total,
  onUpdateQuantity,
  onRemoveItem,
}: CartPageViewProps) {
  if (isLoading) {
    return <CartPageSkeleton />
  }

  if (!hasItems) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          heading="Your cart is empty"
          message="Add products from different vendors and review your order here."
          actionLabel="Continue shopping"
          actionTo="/products"
        />
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <h1 className="text-[1.75rem] font-semibold text-ink mb-6">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          {Object.entries(groupedByVendor).map(([vendorId, items]) => (
            <section key={vendorId} className="bg-surface border border-line rounded-md p-4 space-y-4">
              <VendorStrip vendor={items[0].product.vendor} size="sm" />
              {items.map((item) => (
                <article key={item.id} className="flex gap-3 pb-3 border-b border-line last:border-b-0 last:pb-0">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-sm object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.slug}`} className="text-[0.9375rem] font-medium text-ink hover:text-brand line-clamp-2">
                      {item.product.name}
                    </Link>
                    <p className="text-[0.8125rem] text-ink-muted mt-1">{Object.values(item.variant.attributes || {}).join(' / ')}</p>
                    <p className="text-[0.9375rem] font-semibold text-brand mt-1">₹{item.product.price.toLocaleString('en-IN')}</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(quantity) => onUpdateQuantity(item.id, quantity)}
                        min={1}
                        max={99}
                      />
                      <button
                        type="button"
                        className="h-11 w-11 inline-flex items-center justify-center rounded-md text-ink-muted hover:text-danger hover:bg-danger-subtle"
                        aria-label="Remove item"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          ))}
        </div>

        <aside className="lg:col-span-5">
          <div className="bg-surface border border-line rounded-md p-5 lg:sticky lg:top-[88px] space-y-3">
            <h2 className="text-[1.125rem] font-semibold text-ink">Order Summary</h2>
            <div className="flex items-center justify-between text-[0.9375rem]">
              <span className="text-ink-muted">Subtotal</span>
              <span className="text-ink">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-[0.9375rem]">
              <span className="text-ink-muted">Shipping</span>
              <span className="text-ink-muted">Calculated at checkout</span>
            </div>
            <div className="border-t border-line pt-3 flex items-center justify-between">
              <span className="text-[0.9375rem] font-semibold text-ink">Total</span>
              <span className="text-[1.125rem] font-semibold text-brand">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <Button asChild className="w-full" size="lg">
              <Link href="/checkout">Checkout</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
