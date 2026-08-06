import { generateStaticPageMetadata } from '@/shared/seo/metadata'
import { PATHS } from '@/shared/constants/paths'
import { ProductListingPage } from '@/features/products/pages/ProductListingPage'

export const metadata = generateStaticPageMetadata(
  'Products',
  'Browse our complete collection of premium t-shirts. Find the perfect fit, style, and design from multiple brands.',
  PATHS.products
)

export default function Products() {
  return <ProductListingPage />
}
