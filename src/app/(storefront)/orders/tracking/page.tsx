import { generateNoIndexMetadata } from '@/shared/seo/metadata'
import { TrackingLookupPage } from '@/features/orders/pages/TrackingLookupPage'

export const metadata = generateNoIndexMetadata('Order Tracking')

export default function Tracking() {
  return <TrackingLookupPage />
}
