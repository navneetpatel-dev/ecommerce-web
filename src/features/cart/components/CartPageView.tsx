'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Trash2, ShoppingBag } from 'lucide-react'
import { motion } from 'motion/react'
import { EmptyState } from '@/shared/components/EmptyState'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { QuantitySelector } from '@/shared/components/QuantitySelector'
import { Button } from '@/shared/components/ui/button'
import { CartPageSkeleton } from '@/shared/components/Skeletons'
import type { CartItem } from '@/shared/api/types'

interface CartPageViewProps {
  isLoading?: boolean
  hasItems: boolean
  itemCount: number
  groupedByVendor: Record<string, CartItem[]>
  total: number
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
}

function variantLabel(item: CartItem) {
  return Object.values(item.variant?.attributes || {}).filter(Boolean).join(' · ')
}

export function CartPageView({
  isLoading,
  hasItems,
  itemCount,
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
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
        />
        <div className="relative mx-auto max-w-[1600px] px-4 py-16 md:py-20">
          <EmptyState
            icon={ShoppingBag}
            heading="Your cart is empty"
            message="Browse the collection and add pieces you love — they’ll gather here."
            actionLabel="Continue shopping"
            actionTo="/products"
          />
        </div>
      </div>
    )
  }

  const vendorEntries = Object.entries(groupedByVendor)

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
      />

      <div className="relative mx-auto max-w-[1600px] px-4 py-6 md:py-8">
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
        >
          <TextEyebrow brand>Shopping bag</TextEyebrow>
          <h1
            className="mt-1.5 font-display text-ink leading-[1.1] tracking-tight"
            style={{ fontSize: 'var(--text-display-sm)' }}
          >
            Your Cart
          </h1>
        </motion.header>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:mt-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="space-y-8">
              {vendorEntries.map(([vendorId, items], vendorIndex) => {
                const vendor = items[0]?.product?.vendor
                return (
                  <motion.section
                    key={vendorId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.04 * vendorIndex,
                      ease: [0.2, 0, 0, 1],
                    }}
                  >
                    {vendor && (
                      <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-line pb-2">
                        <div className="flex items-baseline gap-2">
                          <TextEyebrow className="!mb-0">Sold by</TextEyebrow>
                          <Link
                            href={`/products?vendorId=${vendor.id}`}
                            className="font-display text-[1.125rem] text-ink transition-colors hover:text-brand"
                          >
                            {vendor.businessName}
                          </Link>
                        </div>
                        <span className="font-mono text-[0.6875rem] uppercase tracking-wider text-ink-faint">
                          {items.length} {items.length === 1 ? 'piece' : 'pieces'}
                        </span>
                      </div>
                    )}

                    <ul className="divide-y divide-line">
                      {items.map((item) => {
                        const attrs = variantLabel(item)
                        const lineTotal = Number(item.product.price) * item.quantity
                        return (
                          <li
                            key={item.id}
                            className="group grid grid-cols-[4.5rem_1fr] gap-3 py-3.5 sm:grid-cols-[5.5rem_1fr_auto] sm:gap-4"
                          >
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="relative aspect-square overflow-hidden bg-paper"
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
                                    href={`/products/${item.product.slug}`}
                                    className="block text-[0.9375rem] font-medium leading-snug text-ink transition-colors hover:text-brand"
                                  >
                                    {item.product.name}
                                  </Link>
                                  {attrs ? (
                                    <p className="mt-0.5 font-mono text-[0.6875rem] tracking-wide text-ink-muted">
                                      {attrs}
                                    </p>
                                  ) : null}
                                  <p className="mt-1 text-[0.8125rem] text-ink-muted sm:hidden">
                                    ₹{Number(item.product.price).toLocaleString('en-IN')} each
                                  </p>
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
                                <QuantitySelector
                                  value={item.quantity}
                                  onChange={(quantity) => onUpdateQuantity(item.id, quantity)}
                                  min={1}
                                  max={99}
                                />
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

                            <div className="hidden flex-col items-end justify-start gap-1 pt-0.5 sm:flex">
                              <p className="font-display text-[1.125rem] tabular-nums text-ink">
                                ₹{lineTotal.toLocaleString('en-IN')}
                              </p>
                              <p className="text-[0.75rem] text-ink-muted">
                                ₹{Number(item.product.price).toLocaleString('en-IN')} each
                              </p>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </motion.section>
                )
              })}
            </div>

            <div className="mt-6 border-t border-line pt-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-brand transition-colors hover:text-brand-hover"
              >
                Continue shopping
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-[88px] lg:self-start lg:z-10">
            <div className="relative border border-line bg-surface-raised p-5 shadow-elevation-1">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand via-brand/70 to-transparent"
              />

              <p className="text-[0.875rem] text-ink-muted">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
                <span className="mx-2 text-line">·</span>
                <span className="font-medium text-ink">₹{total.toLocaleString('en-IN')}</span>
              </p>

              <TextEyebrow className="mt-4">Order summary</TextEyebrow>
              <h2 className="mt-1 font-display text-[1.25rem] text-ink">Ready to checkout</h2>

              <dl className="mt-5 space-y-2.5 text-[0.875rem]">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-ink-muted">Subtotal</dt>
                  <dd className="tabular-nums text-ink">₹{total.toLocaleString('en-IN')}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-ink-muted">Shipping</dt>
                  <dd className="text-right text-ink-muted">Calculated at checkout</dd>
                </div>
              </dl>

              <div className="mt-4 border-t border-line pt-4">
                <div className="flex items-end justify-between gap-4">
                  <span className="text-[0.875rem] font-medium text-ink">Total</span>
                  <span className="font-display text-[1.5rem] leading-none tabular-nums text-brand">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="mt-1.5 text-[0.75rem] text-ink-muted">
                  Taxes and shipping confirmed at checkout.
                </p>
              </div>

              <Button asChild className="mt-5 w-full" size="lg">
                <Link href="/checkout" className="inline-flex items-center justify-center gap-2">
                  Checkout
                  <ArrowRight size={16} />
                </Link>
              </Button>

              <p className="mt-3 text-center text-[0.75rem] text-ink-muted">
                Secure checkout · Easy returns
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
