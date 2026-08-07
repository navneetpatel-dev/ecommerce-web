import { generateNoIndexMetadata } from '@/shared/seo/metadata'
import { VendorShopSettingsPage } from '@/features/vendor-dashboard/pages/VendorShopSettingsPage'

export const metadata = generateNoIndexMetadata('Shop settings')

export default function VendorShopSettingsRoute() {
  return <VendorShopSettingsPage />
}
