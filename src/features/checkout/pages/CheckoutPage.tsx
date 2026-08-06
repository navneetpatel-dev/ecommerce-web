'use client'

import { useCheckoutPage } from '../hooks/useCheckoutPage'
import { CheckoutPageView } from '../components/CheckoutPageView'

export function CheckoutPage() {
  const checkout = useCheckoutPage()

  return (
    <CheckoutPageView
      isLoading={checkout.isLoading}
      hasItems={checkout.hasItems}
      step={checkout.step}
      addressId={checkout.addressId}
      shippingMethodByVendor={checkout.shippingMethodByVendor}
      addresses={checkout.addresses}
      paymentMethod={checkout.paymentMethod}
      quote={checkout.quote}
      isPending={checkout.isPending}
      paymentError={checkout.paymentError}
      isCreatingAddress={checkout.isCreatingAddress}
      groupedByVendor={checkout.groupedByVendor}
      total={checkout.total}
      shippingReady={checkout.shippingReady}
      onStepClick={checkout.onStepClick}
      onSelectAddress={checkout.onSelectAddress}
      onSelectShipping={checkout.onSelectShipping}
      onContinueToShipping={checkout.onContinueToShipping}
      onContinueToPayment={checkout.onContinueToPayment}
      onBackToShipping={checkout.onBackToShipping}
      onBackToPayment={checkout.onBackToPayment}
      onSelectPayment={checkout.onSelectPayment}
      onPlaceOrder={checkout.onPlaceOrder}
      onCreateAddress={checkout.onCreateAddress}
    />
  )
}
