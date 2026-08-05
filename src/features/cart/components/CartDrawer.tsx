'use client'

import Link from 'next/link'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { VendorStrip } from '@/shared/components/VendorStrip'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { Input } from '@/shared/components/ui/input'
import { EmptyState } from '@/shared/components/EmptyState'
import type { CartItem } from '@/shared/api/types'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  hasItems: boolean
  groupedByVendor: Record<string, CartItem[]>
  total: number
  couponInput: string
  couponMessage: string | null
  couponError: string | null
  couponPending: boolean
  appliedCouponCode: string | null
  onCouponInputChange: (value: string) => void
  onApplyCoupon: () => void
  onContinueShopping: () => void
  onDecreaseQuantity: (item: CartItem) => void
  onIncreaseQuantity: (item: CartItem) => void
  onRemoveItem: (itemId: string) => void
}

export function CartDrawer({
  isOpen,
  onClose,
  hasItems,
  groupedByVendor,
  total,
  couponInput,
  couponMessage,
  couponError,
  couponPending,
  appliedCouponCode,
  onCouponInputChange,
  onApplyCoupon,
  onContinueShopping,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-overlay z-50"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-[400px] max-w-[100vw] bg-surface-raised border-l border-line shadow-elevation-4 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-4 h-14 border-b border-line shrink-0">
              <h2 className="text-[1.125rem] font-semibold">Your Cart</h2>
              <button onClick={onClose} className="p-1 hover:bg-paper rounded" aria-label="Close cart">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              {!hasItems ? (
                <EmptyState
                  heading="Your cart is empty"
                  message="Add some items to get started."
                  icon={ShoppingBag}
                  actionLabel="Continue shopping"
                  onAction={onContinueShopping}
                />
              ) : (
                Object.entries(groupedByVendor).map(([vendorId, items]) => (
                  <div key={vendorId} className="space-y-3">
                    <VendorStrip vendor={items[0].product.vendor} size="sm" />
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 pb-3 border-b border-line last:border-0">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-16 w-16 rounded-sm object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.slug}`}
                            onClick={onClose}
                            className="text-[0.9375rem] font-medium line-clamp-2 hover:text-brand"
                          >
                            {item.product.name}
                          </Link>
                          <p className="font-sans text-[0.9375rem] font-semibold text-brand mt-0.5">
                            ₹{item.product.price.toLocaleString('en-IN')}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => onDecreaseQuantity(item)}
                              className="p-0.5 hover:bg-paper rounded"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-[0.8125rem] w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => onIncreaseQuantity(item)}
                              className="p-0.5 hover:bg-paper rounded"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="p-0.5 hover:bg-paper rounded ml-auto"
                              aria-label="Remove item"
                            >
                              <Trash2 size={14} className="text-ink-muted" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>

            {hasItems ? (
              <div className="border-t border-line p-4 space-y-3 shrink-0">
                <div className="space-y-2">
                  <label htmlFor="cart-coupon-code" className="block text-[0.8125rem] font-medium text-ink">
                    Coupon code
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="cart-coupon-code"
                      placeholder="Coupon code"
                      className="text-[0.9375rem]"
                      value={couponInput}
                      onChange={(e) => onCouponInputChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          onApplyCoupon()
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      onClick={onApplyCoupon}
                      loading={couponPending}
                      disabled={!couponInput.trim()}
                    >
                      Apply
                    </Button>
                  </div>
                  {couponMessage && (
                    <p className="text-[0.8125rem] text-success">{couponMessage}</p>
                  )}
                  {couponError && <p className="text-[0.8125rem] text-danger">{couponError}</p>}
                  {appliedCouponCode && !couponMessage && (
                    <p className="text-[0.8125rem] text-ink-muted">Applied: {appliedCouponCode}</p>
                  )}
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-[0.9375rem] font-medium">Total</span>
                  <span className="text-[1.125rem] font-bold text-brand">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout" onClick={onClose}>
                    Checkout
                  </Link>
                </Button>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="block text-center text-[0.8125rem] text-brand hover:underline"
                >
                  View full cart
                </Link>
              </div>
            ) : null}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
