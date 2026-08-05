import { AddressStep } from './AddressStep'
import { ShippingStep } from './ShippingStep'
import { PaymentStep } from './PaymentStep'
import { ReviewStep } from './ReviewStep'
import { EmptyCart } from './EmptyCart'
import { CheckoutStepIndicator } from '../containers/CheckoutStepIndicator'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/ui/accordion'
import { Separator } from '@/shared/components/ui/separator'
import { VendorStrip } from '@/shared/components/VendorStrip'
import type { Address, CartItem, CheckoutQuote } from '@/shared/api/types'

interface CheckoutPageViewProps {
  hasItems: boolean
  step: number
  addressId: string | null
  shippingMethodByVendor: Record<string, 'STANDARD' | 'EXPRESS'>
  addresses?: Address[]
  walletBalance?: number
  quote?: CheckoutQuote | null
  isPending: boolean
  groupedByVendor: Record<string, CartItem[]>
  total: number
  shippingReady: boolean
  walletDisabled: boolean
  onStepClick: (step: number) => void
  onSelectAddress: (id: string) => void
  onSelectShipping: (vendorId: string, method: 'STANDARD' | 'EXPRESS') => void
  onContinueToShipping: () => void
  onContinueToPayment: () => void
  onBackToShipping: () => void
  onBackToPayment: () => void
  onPay: (method: string) => void
  onPlaceOrder: () => void
}

export function CheckoutPageView({
  hasItems,
  step,
  addressId,
  shippingMethodByVendor,
  addresses,
  walletBalance,
  quote,
  isPending,
  groupedByVendor,
  total,
  shippingReady,
  walletDisabled,
  onStepClick,
  onSelectAddress,
  onSelectShipping,
  onContinueToShipping,
  onContinueToPayment,
  onBackToShipping,
  onBackToPayment,
  onPay,
  onPlaceOrder,
}: CheckoutPageViewProps) {
  if (!hasItems) return <EmptyCart />

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
      <CheckoutStepIndicator currentStep={step} onStepClick={onStepClick} />

      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          {step === 1 && (
            <AddressStep
              addresses={addresses}
              selectedId={addressId}
              onSelect={onSelectAddress}
              onContinue={onContinueToShipping}
            />
          )}
          {step === 2 && (
            <ShippingStep
              groupedByVendor={groupedByVendor}
              selectedMethods={shippingMethodByVendor}
              canContinue={shippingReady}
              onSelect={onSelectShipping}
              onContinue={onContinueToPayment}
            />
          )}
          {step === 3 && (
            <PaymentStep
              walletBalance={walletBalance}
              isPending={isPending}
              walletDisabled={walletDisabled}
              onPay={onPay}
              onBack={onBackToShipping}
            />
          )}
          {step === 4 && quote && (
            <ReviewStep
              quote={quote}
              isPending={isPending}
              onPlaceOrder={onPlaceOrder}
              onBack={onBackToPayment}
            />
          )}
        </div>

        <div className="hidden lg:block lg:col-span-5">
          <div className="sticky top-[88px]">
            {summaryCard}
          </div>
        </div>

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
