import { generateNoIndexMetadata } from '@/shared/seo/metadata'
import { VendorOrdersPage } from '@/features/vendor-dashboard/pages/VendorOrdersPage'

export const metadata = generateNoIndexMetadata('Orders')

export default function VendorOrders() {
  return <VendorOrdersPage />
}
