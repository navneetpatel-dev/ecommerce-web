'use client'

import Link from 'next/link'
import { X, ShoppingBag } from 'lucide-react'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'
import { motion, AnimatePresence } from 'motion/react'
import { VendorStrip } from '@/shared/components/VendorStrip'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { EmptyState } from '@/shared/components/EmptyState'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { CartLineItem } from './CartLineItem'
import { CartCouponSection } from './CartCouponSection'
import type { CartItem, EligibleCoupon } from '@/shared/api/types'

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
  appliedDiscount?: number
  eligible: EligibleCoupon[]
  eligibleLoading?: boolean
  hasUnavailableItems?: boolean
  onCouponInputChange: (value: string) => void
  onApplyCoupon: () => void
  onRemoveCoupon: () => void
  onApplyEligible: (code: string) => void
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
  appliedDiscount,
  eligible,
  eligibleLoading,
  hasUnavailableItems,
  onCouponInputChange,
  onApplyCoupon,
  onRemoveCoupon,
  onApplyEligible,
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
              <h2 className="text-[1.125rem] font-semibold">{LABELS.yourCart}</h2>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={onClose}
                aria-label={LABELS.closeCart}
              >
                <X size={20} />
              </Button>
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
                  heading={LABELS.cartEmptyHeading}
                  message={LABELS.cartEmptyMessage}
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
                <CartCouponSection
                  compact
                  couponInput={couponInput}
                  couponMessage={couponMessage}
                  couponError={couponError}
                  couponPending={couponPending}
                  appliedCouponCode={appliedCouponCode}
                  appliedDiscount={appliedDiscount}
                  eligible={eligible}
                  eligibleLoading={eligibleLoading}
                  onCouponInputChange={onCouponInputChange}
                  onApplyCoupon={onApplyCoupon}
                  onRemoveCoupon={onRemoveCoupon}
                  onApplyEligible={onApplyEligible}
                />
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-[0.9375rem] font-medium">{LABELS.total}</span>
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
                      {LABELS.checkout}
                    </Link>
                  </Button>
                )}
                <Link
                  href={PATHS.cart}
                  onClick={onClose}
                  className="block text-center text-[0.8125rem] text-brand hover:underline"
                >
                  {LABELS.viewFullCart}
                </Link>
              </div>
            ) : null}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
