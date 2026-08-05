'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useCart, useUpdateCartItem, useRemoveCartItem } from '../api/cart.queries'
import { useCartDrawerStore } from '../store/cart.store'
import { groupItemsByVendor, calcCartTotal } from '../utils/cart.utils'
import { VendorStrip } from '@/shared/components/VendorStrip'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { Input } from '@/shared/components/ui/input'
import { EmptyState } from '@/shared/components/EmptyState'
import { ShoppingBag } from 'lucide-react'

export function CartDrawer() {
  const isOpen = useCartDrawerStore((s) => s.isOpen)
  const close = useCartDrawerStore((s) => s.close)
  const { data: cart } = useCart()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()

  const groupedByVendor = useMemo(() => {
    if (!cart?.items) return {}
    return groupItemsByVendor(cart.items)
  }, [cart])

  const total = useMemo(() => {
    if (!cart?.items) return 0
    return calcCartTotal(cart.items)
  }, [cart])

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
            onClick={close}
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
              <button onClick={close} className="p-1 hover:bg-paper rounded" aria-label="Close cart">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              {!cart?.items?.length ? (
                <EmptyState
                  heading="Your cart is empty"
                  message="Add some items to get started."
                  icon={ShoppingBag}
                  actionLabel="Continue shopping"
                  onAction={close}
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
                            onClick={close}
                            className="text-[0.9375rem] font-medium line-clamp-2 hover:text-brand"
                          >
                            {item.product.name}
                          </Link>
                          <p className="font-sans text-[0.9375rem] font-semibold text-brand mt-0.5">
                            ₹{item.product.price.toLocaleString('en-IN')}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => item.quantity > 1 ? updateItem.mutate({ itemId: item.id, quantity: item.quantity - 1 }) : removeItem.mutate(item.id)}
                              className="p-0.5 hover:bg-paper rounded"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-[0.8125rem] w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                              className="p-0.5 hover:bg-paper rounded"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                            <button
                              onClick={() => removeItem.mutate(item.id)}
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

            {cart?.items?.length ? (
              <div className="border-t border-line p-4 space-y-3 shrink-0">
                <div className="flex gap-2">
                  <Input placeholder="Coupon code" className="h-9 text-[0.8125rem]" />
                  <Button variant="outline" size="sm" className="shrink-0">Apply</Button>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-[0.9375rem] font-medium">Total</span>
                  <span className="text-[1.125rem] font-bold text-brand">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout" onClick={close}>Checkout</Link>
                </Button>
                <Link
                  href="/cart"
                  onClick={close}
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
