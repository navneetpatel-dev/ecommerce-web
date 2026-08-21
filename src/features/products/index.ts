// Products feature — public API
export {
  useProduct,
  useProductList,
  usePrefetchProduct,
} from "./api/products.queries";
export { ProductCard } from "./components/ProductCard";
export { ProductGrid } from "./components/ProductGrid";
export { ProductCardContainer } from "./containers/ProductCardContainer";
export { VariantSelector } from "./components/VariantSelector";
export { ProductListingPage } from "./pages/ProductListingPage";
export { ProductDetailPage } from "./pages/ProductDetailPage";
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
