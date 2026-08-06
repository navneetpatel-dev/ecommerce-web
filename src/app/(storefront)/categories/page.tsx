import { generateStaticPageMetadata } from '@/shared/seo/metadata'
import { CategoriesPage } from '@/features/categories/pages/CategoriesPage'
import { PATHS } from '@/shared/constants/paths'

export const metadata = generateStaticPageMetadata(
  'Categories',
  'Browse every category on Marketplace — handcrafted goods, artisan food, and more from independent sellers.',
  PATHS.categories
)

export default function Categories() {
  return <CategoriesPage />
}
