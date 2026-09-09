// Categories feature — public API
export { categoriesApi } from "./api/browse/categories.api";
export { useCategories } from "./api/browse/categories.queries";
export {
  resolveCategoryBySlugServer,
  buildCategoryBreadcrumbTrail,
  toCategoryMetadataInput,
  hasFilterOrSortParams,
  categoryNotFoundMetadata,
} from "./api/plp/categoryResolve.server";
export type {
  ResolvedCategorySeo,
  CategoryBreadcrumbTrail,
} from "./types/plp/categorySeo.types";
export { CategoryCard } from "./components/browse/CategoryCard.component";
export { CategoryMoreCard } from "./components/browse/CategoryMoreCard.component";
export { CategoriesMegaMenu } from "./components/mega-menu/CategoriesMegaMenu/index";
export { CategoriesPage } from "./pages/browse/CategoriesPage.page";
export { CategoryPlpPage } from "./pages/plp/CategoryPlpPage.page";
export {
  getRootCategories,
  getChildCategories,
  resolveCategoryIcon,
  resolveCategoryImageUrl,
  categoryHref,
  buildCategorySlugPath,
  flattenCategories,
  flattenCategoriesWithDepth,
} from "./utils/browse/categoryHelpers";
