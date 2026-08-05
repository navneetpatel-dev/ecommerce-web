'use client'

import { useOrderConfirmationPage } from '../hooks/useOrderConfirmationPage'
import { OrderConfirmation } from '../components/OrderConfirmation'

export function OrderConfirmationPage() {
  const page = useOrderConfirmationPage()
  return <OrderConfirmation orderId={page.orderId} />
}
