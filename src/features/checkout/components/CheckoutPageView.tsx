'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { AddressStep } from './AddressStep'
import { ShippingStep } from './ShippingStep'
import { PaymentStep } from './PaymentStep'
import { ReviewStep } from './ReviewStep'
import { EmptyCart } from './EmptyCart'
import { CheckoutStepIndicator } from '../containers/CheckoutStepIndicator'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/ui/accordion'
import { VendorStrip } from '@/shared/components/VendorStrip'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { CheckoutPageSkeleton } from '@/shared/components/Skeletons'
import type { Address, CartItem, CheckoutQuote } from '@/shared/api/types'

interface CheckoutPageViewProps {
  isLoading?: boolean
  hasItems: boolean
  step: number
  addressId: string | null
  shippingMethodByVendor: Record<string, 'STANDARD' | 'EXPRESS'>
  addresses?: Address[]
  paymentMethod?: string | null
  quote?: CheckoutQuote | null
  isPending: boolean
  paymentError?: string | null
  isCreatingAddress?: boolean
  groupedByVendor: Record<string, CartItem[]>
  total: number
  shippingReady: boolean
  onStepClick: (step: number) => void
  onSelectAddress: (id: string) => void
  onSelectShipping: (vendorId: string, method: 'STANDARD' | 'EXPRESS') => void
  onContinueToShipping: () => void
  onContinueToPayment: () => void
  onBackToShipping: () => void
  onBackToPayment: () => void
  onSelectPayment: (method: string) => void
  onContinueToReview: () => void
  onPlaceOrder: () => void
  onCreateAddress: (body: Omit<Address, 'id' | 'userId'>) => Promise<void>
}

const STEP_COPY: Record<number, { eyebrow: string; title: string; blurb: string }> = {
  1: {
    eyebrow: 'Step 1 · Address',
    title: 'Where should we send it?',
    blurb: 'Choose a saved address or add a new one for delivery.',
  },
  2: {
    eyebrow: 'Step 2 · Shipping',
    title: 'How should it arrive?',
    blurb: 'Pick a shipping speed for each vendor in your bag.',
  },
  3: {
    eyebrow: 'Step 3 · Payment',
    title: 'How will you pay?',
    blurb: 'Select a payment method, then review your order.',
  },
  4: {
    eyebrow: 'Step 4 · Review',
    title: 'Confirm your order',
    blurb: 'One last look — totals, shipping, and taxes included.',
  },
}

function OrderSummaryPanel({
  groupedByVendor,
  total,
  quote,
}: {
  groupedByVendor: Record<string, CartItem[]>
  total: number
  quote?: CheckoutQuote | null
}) {
  const items = Object.values(groupedByVendor).flat()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const displayTotal = quote?.grandTotal ?? total
  const vendorEntries = Object.entries(groupedByVendor)

  return (
    <div className="relative flex max-h-[calc(100vh-7rem)] flex-col border border-line bg-surface-raised shadow-elevation-1">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 bg-gradient-to-r from-brand via-brand/70 to-transparent"
      />

      <div className="shrink-0 border-b border-line px-5 pb-4 pt-5 md:px-6 md:pt-6">
        <p className="text-[0.875rem] text-ink-muted">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
          <span className="mx-2 text-line">·</span>
          <span className="font-medium text-ink">₹{displayTotal.toLocaleString('en-IN')}</span>
        </p>
        <TextEyebrow className="mt-4">Order summary</TextEyebrow>
        <h2 className="mt-1 font-display text-[1.25rem] text-ink">Your bag</h2>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-4 md:px-6">
        {vendorEntries.map(([vendorId, vendorItems]) => (
          <div key={vendorId}>
            <VendorStrip vendor={vendorItems[0]?.product?.vendor} size="sm" />
            <ul className="mt-3 space-y-3">
              {vendorItems.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm border border-line bg-paper">
                    {item.product.imageUrl ? (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.875rem] font-medium text-ink">{item.product.name}</p>
                    <p className="mt-0.5 text-[0.75rem] text-ink-muted">Qty {item.quantity}</p>
                  </div>
                  <p className="shrink-0 text-[0.875rem] tabular-nums text-ink">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="shrink-0 border-t border-line bg-surface-raised px-5 py-4 md:px-6 md:py-5">
        <dl className="space-y-2.5 text-[0.875rem]">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-ink-muted">Subtotal</dt>
            <dd className="tabular-nums text-ink">₹{total.toLocaleString('en-IN')}</dd>
          </div>
          {quote?.appliedCoupon && (
            <div className="flex items-center justify-between gap-4 text-success">
              <dt>Coupon · {quote.appliedCoupon.code}</dt>
              <dd className="tabular-nums">−₹{quote.appliedCoupon.discount.toLocaleString('en-IN')}</dd>
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
            <dt className="text-ink-muted">Shipping & tax</dt>
            <dd className="text-right text-ink-muted">
              {quote ? 'Included below' : 'Confirmed on review'}
            </dd>
          </div>
        </dl>

        <div className="mt-4 border-t border-line pt-4">
          <div className="flex items-end justify-between gap-4">
            <span className="text-[0.875rem] font-medium text-ink">
              {quote ? 'Order total' : 'Estimated total'}
            </span>
            <span className="font-display text-[1.5rem] leading-none tabular-nums text-brand">
              ₹{displayTotal.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="mt-1.5 text-[0.75rem] text-ink-muted">
            {quote
              ? 'Final amount including shipping and taxes.'
              : 'Shipping and taxes confirmed before you place the order.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export function CheckoutPageView({
  isLoading,
  hasItems,
  step,
  addressId,
  shippingMethodByVendor,
  addresses,
  paymentMethod,
  quote,
  isPending,
  paymentError,
  isCreatingAddress,
  groupedByVendor,
  total,
  shippingReady,
  onStepClick,
  onSelectAddress,
  onSelectShipping,
  onContinueToShipping,
  onContinueToPayment,
  onBackToShipping,
  onBackToPayment,
  onSelectPayment,
  onContinueToReview,
  onPlaceOrder,
  onCreateAddress,
}: CheckoutPageViewProps) {
  if (isLoading) return <CheckoutPageSkeleton />
  if (!hasItems) return <EmptyCart />

  const copy = STEP_COPY[step] ?? STEP_COPY[1]
  const summary = (
    <OrderSummaryPanel groupedByVendor={groupedByVendor} total={total} quote={quote} />
  )

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
      />

      <div className="relative mx-auto max-w-[1600px] px-4 py-6 md:py-8">
        {/*
          Two-column layout from the top so the summary can stick:
          left column (title + steps + form) defines row height;
          right column stretches and hosts a sticky panel.
        */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-7 xl:col-span-8">
            <motion.header
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
            >
              <TextEyebrow brand>Checkout</TextEyebrow>
              <h1
                className="mt-1.5 font-display text-ink leading-[1.1] tracking-tight"
                style={{ fontSize: 'var(--text-display-sm)' }}
              >
                Complete your order
              </h1>
            </motion.header>

            <div className="mt-6 md:mt-8">
              <CheckoutStepIndicator currentStep={step} onStepClick={onStepClick} />
            </div>

            <div className="mt-6 lg:hidden">
              <Accordion type="single" collapsible>
                <AccordionItem value="summary" className="border-line">
                  <AccordionTrigger className="text-[0.9375rem] font-medium">
                    Order summary · ₹{(quote?.grandTotal ?? total).toLocaleString('en-IN')}
                  </AccordionTrigger>
                  <AccordionContent>{summary}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <section className="mt-8 border border-line bg-surface-raised p-5 shadow-elevation-1 md:p-7 lg:mt-10 lg:p-8">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
              >
                <TextEyebrow>{copy.eyebrow}</TextEyebrow>
                <h2 className="mt-1.5 font-display text-[1.5rem] leading-tight text-ink md:text-[1.75rem]">
                  {copy.title}
                </h2>
                <p className="mt-2 max-w-[42ch] text-[0.9375rem] text-ink-muted">{copy.blurb}</p>

                <div className="mt-6 border-t border-line pt-6 md:mt-8 md:pt-8">
                  <AnimatePresence mode="wait" initial={false}>
                    {step === 1 && (
                      <motion.div
                        key="address"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
                      >
                        <AddressStep
                          addresses={addresses}
                          selectedId={addressId}
                          isCreating={isCreatingAddress}
                          onSelect={onSelectAddress}
                          onContinue={onContinueToShipping}
                          onCreateAddress={onCreateAddress}
                        />
                      </motion.div>
                    )}
                    {step === 2 && (
                      <motion.div
                        key="shipping"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
                      >
                        <ShippingStep
                          groupedByVendor={groupedByVendor}
                          selectedMethods={shippingMethodByVendor}
                          canContinue={shippingReady}
                          onSelect={onSelectShipping}
                          onContinue={onContinueToPayment}
                        />
                      </motion.div>
                    )}
                    {step === 3 && (
                      <motion.div
                        key="payment"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
                      >
                        <PaymentStep
                          isPending={isPending}
                          selectedMethod={paymentMethod}
                          onSelect={onSelectPayment}
                          onContinue={onContinueToReview}
                          onBack={onBackToShipping}
                        />
                      </motion.div>
                    )}
                    {step === 4 && (
                      <motion.div
                        key="review"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
                      >
                        <ReviewStep
                          quote={quote ?? null}
                          isPending={isPending}
                          paymentError={paymentError}
                          onPlaceOrder={onPlaceOrder}
                          onBack={onBackToPayment}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </section>
          </div>

          <aside className="relative hidden lg:col-span-5 lg:block xl:col-span-4">
            <div className="sticky top-[88px] z-10">
              {summary}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
