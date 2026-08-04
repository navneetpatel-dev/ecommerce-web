import { generateNoIndexMetadata } from '@/shared/seo/metadata'
import { ProductModerationQueue } from '@/features/admin-dashboard/pages/ProductModerationQueue'

export const metadata = generateNoIndexMetadata('Product Moderation')

export default function AdminProducts() {
  return <ProductModerationQueue />
}
