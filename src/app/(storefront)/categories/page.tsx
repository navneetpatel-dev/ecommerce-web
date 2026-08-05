import { generateStaticPageMetadata } from '@/shared/seo/metadata'
import { CategoriesPage } from '@/features/categories/pages/CategoriesPage'

export const metadata = generateStaticPageMetadata(
  'Categories',
  'Browse every category on Marketplace — handcrafted goods, artisan food, and more from independent sellers.',
  '/categories'
)

export default function Categories() {
  return <CategoriesPage />
}
