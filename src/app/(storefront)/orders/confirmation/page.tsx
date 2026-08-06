import { redirect } from 'next/navigation'
import { generateNoIndexMetadata } from '@/shared/seo/metadata'

export const metadata = generateNoIndexMetadata('Order Confirmation')

/** Legacy path — checkout uses `/orders/[orderId]/confirmation`. */
export default function LegacyOrderConfirmationPage() {
  redirect('/orders')
}
