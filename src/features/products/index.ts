// Products feature — public API
export {
  useProduct,
  useProductList,
  usePrefetchProduct,
} from "./api/products.queries";
export { ProductCard } from "./components/ProductCard.component";
export { ProductSeoJsonLd } from "./components/ProductSeoJsonLd.component";
export { ProductGrid } from "./components/ProductGrid.component";
export { ProductCardContainer } from "./containers/ProductCardContainer.container";
export { VariantSelector } from "./components/VariantSelector.component";
export { ProductListingPage } from "./pages/ProductListingPage.page";
export { ProductDetailPage } from "./pages/ProductDetailPage.page";
export { productsApi } from "./api/products.api";
export { PRODUCT_FIELD_LIMITS } from "./constants/productFields";
export {
  emptySpecRow,
  emptyProductListingValues,
  listingValuesFromProduct,
  parseProductListingForm,
  productFormFieldErrors,
  toProductWriteBody,
  type ProductCodMode,
  type ProductListingFormField,
  type ProductListingFormValues,
  type ProductWriteBody,
} from "./schemas/products.schema";
export { SORT_OPTIONS } from "./hooks/useProductListing.hook";
export type {
  ProductFilters,
  ProductListResponse,
  BulkImportRowResult,
} from "./api/products.api";
export { FilterSidebar } from "./components/FilterSidebar.component";
export { SortBar } from "./components/SortBar.component";
export { RecentlyViewedSection } from "./components/RecentlyViewedSection.component";
export { useRecentlyViewed } from "./hooks/useRecentlyViewed.hook";
export {
  productDetailToListItem,
  productNeedsVariantHydration,
} from "./utils/productListItem";
export { ProductCompareBar } from "./components/ProductCompareBar.component";
export { ProductCompareSection } from "./components/ProductCompareSection.component";
