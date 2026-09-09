// Products feature — public API
export {
  useProduct,
  useProductList,
  usePrefetchProduct,
} from "./api/listing/products.queries";
export { ProductCard } from "./components/card/ProductCard.component";
export { ProductSeoJsonLd } from "./components/detail/ProductSeoJsonLd.component";
export { ProductGrid } from "./components/listing/ProductGrid.component";
export { ProductCardContainer } from "./containers/card/ProductCardContainer.container";
export { VariantSelector } from "./components/variants/VariantSelector.component";
export { ProductListingPage } from "./pages/listing/ProductListingPage.page";
export { ProductDetailPage } from "./pages/detail/ProductDetailPage.page";
export { productsApi } from "./api/listing/products.api";
export { PRODUCT_FIELD_LIMITS } from "./constants/listing-form/productFields";
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
} from "./schemas/listing-form/products.schema";
export { SORT_OPTIONS } from "./hooks/listing/useProductListing.hook";
export type {
  ProductFilters,
  ProductListResponse,
  BulkImportRowResult,
} from "./api/listing/products.api";
export { FilterSidebar } from "./components/filters/FilterSidebar.component";
export { SortBar } from "./components/sort/SortBar.component";
export { RecentlyViewedSection } from "./components/related/RecentlyViewedSection.component";
export { useRecentlyViewed } from "./hooks/related/useRecentlyViewed.hook";
export {
  productDetailToListItem,
  productNeedsVariantHydration,
} from "./utils/card/productListItem";
export { ProductCompareBar } from "./components/compare/ProductCompareBar.component";
export { ProductCompareSection } from "./components/compare/ProductCompareSection.component";
export { MAX_COMPARED_PRODUCTS } from "./constants/compare/compare";
