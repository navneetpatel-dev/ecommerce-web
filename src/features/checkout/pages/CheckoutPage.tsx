'use client'
import { useMemo, useState } from 'react'
import { useCart } from '@/features/cart/api/cart.queries'
import { groupItemsByVendor, calcCartTotal } from '@/features/cart/utils/cart.utils'
import { useWalletBalance } from '@/features/wallet/api/wallet.queries'
import { useCheckoutStore } from '../store/checkout.store'
import { useAddresses } from '../api/checkout.queries'
import { usePlaceOrderWithRazorpay } from '../hooks/usePlaceOrder'
import { StepIndicator } from '../components/StepIndicator'
import { AddressStep } from '../components/AddressStep'
import { ShippingStep } from '../components/ShippingStep'
import { PaymentStep } from '../components/PaymentStep'
import { ReviewStep } from '../components/ReviewStep'
import { EmptyCart } from '../components/EmptyCart'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/ui/accordion'
import { Separator } from '@/shared/components/ui/separator'
import { VendorStrip } from '@/shared/components/VendorStrip'

export function CheckoutPage() {
  const { step, addressId, shippingMethodByVendor, setStep, setAddress, setShippingMethod } = useCheckoutStore()
  const { data: cart } = useCart()
  const { data: addresses } = useAddresses()
  const { data: walletBalance } = useWalletBalance()
  const { handlePlaceOrder, quote, isPending } = usePlaceOrderWithRazorpay()

  const groupedByVendor = useMemo(() => {
    if (!cart?.items) return {}
    return groupItemsByVendor(cart.items)
  }, [cart])

  const total = useMemo(() => {
    if (!cart?.items) return 0
    return calcCartTotal(cart.items)
  }, [cart])

  if (!cart?.items?.length) return <EmptyCart />

  const summaryCard = (
    <div className="bg-surface border border-line rounded-md p-5 space-y-4">
      <h3 className="font-semibold text-[1.125rem]">Order Summary</h3>
      {Object.entries(groupedByVendor).map(([vendorId, items]) => (
        <div key={vendorId}>
          <VendorStrip vendor={items[0].product.vendor} size="sm" />
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-[0.8125rem] mt-2">
              <span className="text-ink-muted">{item.product.name} × {item.quantity}</span>
              <span className="text-ink">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      ))}
      <Separator />
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span className="text-brand">₹{total.toLocaleString('en-IN')}</span>
      </div>
    </div>
  )

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <StepIndicator currentStep={step} onStepClick={(s) => setStep(s as 1 | 2 | 3 | 4)} />

      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          {step === 1 && <AddressStep addresses={addresses} selectedId={addressId} onSelect={setAddress} onContinue={() => setStep(2)} />}
          {step === 2 && <ShippingStep groupedByVendor={groupedByVendor} selectedMethods={shippingMethodByVendor} onSelect={setShippingMethod} onContinue={() => setStep(3)} />}
          {step === 3 && <PaymentStep walletBalance={walletBalance} grandTotal={quote?.grandTotal} isPending={isPending} onPay={handlePlaceOrder} onBack={() => setStep(2)} />}
          {step === 4 && quote && <ReviewStep quote={quote} isPending={isPending} onPlaceOrder={() => handlePlaceOrder('razorpay')} onBack={() => setStep(3)} />}
        </div>

        {/* Desktop order summary sidebar */}
        <div className="hidden lg:block lg:col-span-5">
          <div className="sticky top-[88px]">
            {summaryCard}
          </div>
        </div>

        {/* Mobile order summary accordion */}
        <div className="lg:hidden mt-6">
          <Accordion type="single" collapsible>
            <AccordionItem value="summary">
              <AccordionTrigger>Order Summary</AccordionTrigger>
              <AccordionContent>
                {summaryCard}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}
