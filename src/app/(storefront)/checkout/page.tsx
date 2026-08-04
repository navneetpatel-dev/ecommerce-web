import { generateNoIndexMetadata } from '@/shared/seo/metadata'
import { CheckoutPage } from '@/features/checkout/pages/CheckoutPage'

export const metadata = generateNoIndexMetadata('Checkout')

export default function Checkout() {
  return <CheckoutPage />
}
