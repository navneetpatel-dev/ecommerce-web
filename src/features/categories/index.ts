// Categories feature — public API
export { categoriesApi } from "./api/categories.api";
export { useCategories } from "./api/categories.queries";
export {
  resolveCategoryBySlugServer,
  buildCategoryBreadcrumbTrail,
  toCategoryMetadataInput,
  hasFilterOrSortParams,
  categoryNotFoundMetadata,
} from "./api/categoryResolve.server";
export type {
  ResolvedCategorySeo,
  CategoryBreadcrumbTrail,
} from "./types/categorySeo.types";
export { CategoryCard } from "./components/CategoryCard.component";
export { CategoriesMegaMenu } from "./components/CategoriesMegaMenu";
export { CategoriesPage } from "./pages/CategoriesPage.page";
export { CategoryPlpPage } from "./pages/CategoryPlpPage.page";
export {
  getRootCategories,
  getChildCategories,
  resolveCategoryIcon,
  resolveCategoryImageUrl,
  categoryHref,
  buildCategorySlugPath,
  flattenCategories,
  flattenCategoriesWithDepth,
} from "./utils/categoryHelpers";
