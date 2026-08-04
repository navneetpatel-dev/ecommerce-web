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
            className="fixed inset-0 bg-black/30 z-50"
            onClick={close}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-96 max-w-[100vw] bg-surface border-l border-line shadow-xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-4 h-14 border-b border-line shrink-0">
              <h2 className="font-semibold">Your Cart</h2>
              <button onClick={close} className="p-1 hover:bg-paper rounded">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              {!cart?.items?.length ? (
                <p className="text-center text-ink/50 py-12">Your cart is empty</p>
              ) : (
                Object.entries(groupedByVendor).map(([vendorId, items]) => (
                  <div key={vendorId} className="space-y-3">
                    <VendorStrip vendor={items[0].product.vendor} size="sm" />
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 pb-3 border-b border-line last:border-0">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-16 w-16 rounded-md object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.product.slug}`} onClick={close} className="text-sm font-medium line-clamp-2 hover:text-brand">
                            {item.product.name}
                          </Link>
                          <p className="font-mono text-sm text-brand mt-0.5">₹{item.product.price}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => item.quantity > 1 ? updateItem.mutate({ itemId: item.id, quantity: item.quantity - 1 }) : removeItem.mutate(item.id)}
                              className="p-0.5 hover:bg-paper rounded"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-mono w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                              className="p-0.5 hover:bg-paper rounded"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => removeItem.mutate(item.id)}
                              className="p-0.5 hover:bg-paper rounded ml-auto"
                            >
                              <Trash2 className="h-3 w-3 text-ink/50" />
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
                <Separator />
                <div className="flex justify-between items-center font-mono">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-lg font-bold text-brand">₹{total}</span>
                </div>
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout" onClick={close}>Checkout</Link>
                </Button>
              </div>
            ) : null}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
