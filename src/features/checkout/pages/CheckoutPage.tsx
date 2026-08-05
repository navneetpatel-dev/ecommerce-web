'use client'

import { useCheckoutPage } from '../hooks/useCheckoutPage'
import { CheckoutPageView } from '../components/CheckoutPageView'

export function CheckoutPage() {
  const checkout = useCheckoutPage()

  return (
    <CheckoutPageView
      hasItems={checkout.hasItems}
      step={checkout.step}
      addressId={checkout.addressId}
      shippingMethodByVendor={checkout.shippingMethodByVendor}
      addresses={checkout.addresses}
      walletBalance={checkout.walletBalance}
      quote={checkout.quote}
      isPending={checkout.isPending}
      groupedByVendor={checkout.groupedByVendor}
      total={checkout.total}
      shippingReady={checkout.shippingReady}
      walletDisabled={checkout.walletDisabled}
      onStepClick={checkout.onStepClick}
      onSelectAddress={checkout.onSelectAddress}
      onSelectShipping={checkout.onSelectShipping}
      onContinueToShipping={checkout.onContinueToShipping}
      onContinueToPayment={checkout.onContinueToPayment}
      onBackToShipping={checkout.onBackToShipping}
      onBackToPayment={checkout.onBackToPayment}
      onPay={checkout.onPay}
      onPlaceOrder={checkout.onPlaceOrder}
    />
  )
}
