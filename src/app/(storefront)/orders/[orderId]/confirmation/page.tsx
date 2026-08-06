import { generateNoIndexMetadata } from '@/shared/seo/metadata'
import { OrderConfirmationPage } from '@/features/orders/pages/OrderConfirmationPage'

export const metadata = generateNoIndexMetadata('Order Confirmation')

export default function OrderConfirmationRoute() {
  return <OrderConfirmationPage />
}
