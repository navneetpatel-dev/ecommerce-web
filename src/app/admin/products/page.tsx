import { generateNoIndexMetadata } from '@/shared/seo/metadata'
import { AdminProductsPage } from '@/features/admin-dashboard/pages/AdminProductsPage'

export const metadata = generateNoIndexMetadata('Product Moderation')

export default function AdminProducts() {
  return <AdminProductsPage />
}
