// Categories feature — public API
export { categoriesApi } from './api/categories.api'
export { useCategories } from './api/categories.queries'
export { CategoryCard } from './components/CategoryCard'
export { CategoriesMegaMenu } from './components/CategoriesMegaMenu'
export { CategoriesPage } from './pages/CategoriesPage'
export { CategoryPlpPage } from './pages/CategoryPlpPage'
export {
  getRootCategories,
  getChildCategories,
  resolveCategoryIcon,
  resolveCategoryImageUrl,
  categoryHref,
  buildCategorySlugPath,
  flattenCategories,
  flattenCategoriesWithDepth,
} from './utils/categoryHelpers'
