'use client'
import { useMemo } from 'react'
import { useCart } from '@/features/cart/api/cart.queries'
import { groupItemsByVendor } from '@/features/cart/utils/cart.utils'
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

  if (!cart?.items?.length) return <EmptyCart />

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <StepIndicator currentStep={step} onStepClick={setStep} />

      {step === 1 && <AddressStep addresses={addresses} selectedId={addressId} onSelect={setAddress} onContinue={() => setStep(2)} />}
      {step === 2 && <ShippingStep groupedByVendor={groupedByVendor} selectedMethods={shippingMethodByVendor} onSelect={setShippingMethod} onContinue={() => setStep(3)} />}
      {step === 3 && <PaymentStep walletBalance={walletBalance} grandTotal={quote?.grandTotal} isPending={isPending} onPay={handlePlaceOrder} onBack={() => setStep(2)} />}
      {step === 4 && quote && <ReviewStep quote={quote} isPending={isPending} onPlaceOrder={() => handlePlaceOrder('razorpay')} onBack={() => setStep(3)} />}
    </div>
  )
}
