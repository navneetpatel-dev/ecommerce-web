'use client'

import Link from 'next/link'
import { X, ShoppingBag } from 'lucide-react'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'
import { motion, AnimatePresence } from 'motion/react'
import { VendorStrip } from '@/shared/components/VendorStrip'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { Input } from '@/shared/components/ui/input'
import { EmptyState } from '@/shared/components/EmptyState'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { CartLineItem } from './CartLineItem'
import type { CartItem } from '@/shared/api/types'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  isLoading?: boolean
  hasItems: boolean
  groupedByVendor: Record<string, CartItem[]>
  total: number
  couponInput: string
  couponMessage: string | null
  couponError: string | null
  couponPending: boolean
  appliedCouponCode: string | null
  hasUnavailableItems?: boolean
  onCouponInputChange: (value: string) => void
  onApplyCoupon: () => void
  onContinueShopping: () => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
}

export function CartDrawer({
  isOpen,
  onClose,
  isLoading,
  hasItems,
  groupedByVendor,
  total,
  couponInput,
  couponMessage,
  couponError,
  couponPending,
  appliedCouponCode,
  hasUnavailableItems,
  onCouponInputChange,
  onApplyCoupon,
  onContinueShopping,
  onUpdateQuantity,
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
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full rounded-md" />
                  <Skeleton className="h-20 w-full rounded-md" />
                  <Skeleton className="h-20 w-full rounded-md" />
                </div>
              ) : !hasItems ? (
                <EmptyState
                  heading="Your cart is empty"
                  message="Add some items to get started."
                  icon={ShoppingBag}
                  actionLabel={LABELS.continueShopping}
                  onAction={onContinueShopping}
                />
              ) : (
                Object.entries(groupedByVendor).map(([vendorId, items]) => (
                  <div key={vendorId} className="space-y-3">
                    <VendorStrip vendor={items[0].product.vendor} size="sm" />
                    {items.map((item) => (
                      <CartLineItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemoveItem={onRemoveItem}
                        compact
                      />
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
                  <div className="flex w-full items-stretch gap-2">
                    <Input
                      id="cart-coupon-code"
                      placeholder="Coupon code"
                      className="min-w-0 flex-1"
                      value={couponInput}
                      onChange={(e) => onCouponInputChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          onApplyCoupon()
                        }
                      }}
                    />
                    <DisabledActionHint
                      disabled={!couponInput.trim()}
                      message="Enter a coupon code to apply it."
                      className="shrink-0"
                    >
                      <Button
                        variant="outline"
                        className="h-11 shrink-0 px-4"
                        onClick={onApplyCoupon}
                        loading={couponPending}
                        disabled={!couponInput.trim()}
                      >
                        Apply
                      </Button>
                    </DisabledActionHint>
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
                {hasUnavailableItems ? (
                  <p className="rounded-sm bg-warning-subtle px-3 py-2 text-[0.8125rem] text-warning-foreground">
                    {LABELS.removeUnavailableToCheckout}
                  </p>
                ) : (
                  <Button asChild size="lg" className="w-full">
                    <Link href={PATHS.checkout} onClick={onClose}>
                      Checkout
                    </Link>
                  </Button>
                )}
                <Link
                  href={PATHS.cart}
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
