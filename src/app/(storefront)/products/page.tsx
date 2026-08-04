import { generateStaticPageMetadata } from '@/shared/seo/metadata'
import { ProductListingPage } from '@/features/products/pages/ProductListingPage'

export const metadata = generateStaticPageMetadata(
  'Products',
  'Browse our complete collection of premium t-shirts. Find the perfect fit, style, and design from multiple brands.',
  '/products'
)

export default function Products() {
  return <ProductListingPage />
}
