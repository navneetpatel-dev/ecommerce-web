import { apiClient } from "@/shared/api/client/client";
import { postFile } from "@/shared/api/client/postFile";
import {
  unwrapPaginatedList,
  buildSearchParams,
  type PaginatedList,
} from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";
import type {
  ProductListItem,
  ProductDetail,
  ProductVariant,
  ProductImage,
} from "@/shared/api/types";
import type { ProductWriteBody } from "../../schemas/listing-form/products.schema";

export interface BulkImportRowResult {
  row: number;
  success: boolean;
  productId?: string;
  error?: string;
}

export interface ProductFilters {
  categoryId?: string;
  vendorId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  /** Only products with a variant in stock (B-23). */
  inStock?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
  status?: string;
  includeDescendants?: boolean;
  excludeProductId?: string;
  /** Attribute facet selections: filterKey → values (OR within key). */
  attrs?: Record<string, string[]>;
}

export type ProductListResponse = PaginatedList<ProductListItem>;

/** What customers pay for a pre-GST price in a category, and the GST rate charged. */
export interface GstPricePreview {
  gstPercentage: number;
  displayPrice: number;
}

/** One category of the product form's picker, with its GST (own or inherited). */
export interface CategoryPickerItem {
  id: string;
  name: string;
  depth: number;
  imageUrl: string | null;
  /** Where a search result sits in the tree ("Home & Kitchen › Cookware"). */
  path: string | null;
  gstPercentage: number;
  priceBandThreshold: number | null;
  gstPercentageAbove: number | null;
}

export interface VariantWriteBody {
  sku: string;
  attributes: Record<string, string>;
  price: number;
  stock: number;
  /** Required when a platform admin changes the price of a live product. */
  changeReason?: string;
}

export const productsApi = {
  list: async (filters: ProductFilters): Promise<ProductListResponse> => {
    const params = buildSearchParams({
      categoryId: filters.categoryId,
      vendorId: filters.vendorId,
      search: filters.search,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      rating: filters.rating,
      inStock: filters.inStock ? true : undefined,
      sort: filters.sort,
      page: filters.page,
      limit: filters.limit,
      status: filters.status,
      includeDescendants: filters.includeDescendants ? true : undefined,
      excludeProductId: filters.excludeProductId,
    });
    if (filters.attrs) {
      for (const [key, values] of Object.entries(filters.attrs)) {
        if (values.length) params.set(key, values.join(","));
      }
    }
    const query = params.toString();
    const res = await apiClient.getWithResponse<ProductListItem[]>(
      API.products.list(query),
    );
    return unwrapPaginatedList(res);
  },
  detail: (slugOrId: string) =>
    apiClient.get<ProductDetail>(API.products.detail(slugOrId)),
  /** Vendor/admin. The GST-inclusive price customers see for a pre-GST price. */
  gstPreview: (categoryId: string, price: number) =>
    apiClient.get<GstPricePreview>(
      API.products.gstPreview(
        buildSearchParams({ categoryId, price }).toString(),
      ),
    ),
  /** Vendor/admin: one page of the category picker (the tree, or a search), or one category by id. */
  categoryPicker: async (params: {
    page: number;
    limit: number;
    search?: string;
    id?: string;
  }): Promise<PaginatedList<CategoryPickerItem>> => {
    const res = await apiClient.getWithResponse<CategoryPickerItem[]>(
      API.categories.picker(buildSearchParams(params).toString()),
    );
    return unwrapPaginatedList(res);
  },
  detailBySlug: (slug: string) =>
    apiClient.get<ProductDetail>(API.products.bySlug(slug)),
  /** Authenticated-only. Upserts a view so a repeat view refreshes recency instead of duplicating. */
  trackRecentlyViewed: (productId: string) =>
    apiClient.post<void>(API.products.recentlyViewed, { productId }),
  /** Authenticated-only. Caller's most recently viewed products, newest first. */
  recentlyViewed: () =>
    apiClient.get<ProductListItem[]>(API.products.recentlyViewed),
  /** Public. Precomputed "frequently bought together" products for the given product, ranked by score. */
  frequentlyBoughtTogether: (productId: string) =>
    apiClient.get<ProductListItem[]>(
      API.products.frequentlyBoughtTogether(productId),
    ),
  create: (body: ProductWriteBody) =>
    apiClient.post<ProductDetail>(API.products.list(), body),
  /** Admin: list a draft product for an approved vendor. */
  createOnBehalf: (vendorId: string | undefined, product: ProductWriteBody) =>
    apiClient.post<ProductDetail>(API.products.onBehalf, { vendorId, product }),
  /** Admin: submit a platform-listed product, recording how the vendor agreed. */
  submitOnBehalf: (id: string, consentNote: string) =>
    apiClient.post<ProductDetail>(API.products.submitOnBehalf(id), {
      consentNote,
    }),
  /** Vendor-scoped CSV bulk import — one row per product, text/numeric fields only. */
  bulkImport: (file: File) =>
    postFile<BulkImportRowResult[]>(API.products.bulkImport, file),
  update: (
    id: string,
    body: Partial<ProductWriteBody> & { changeReason?: string },
  ) => apiClient.patch<ProductDetail>(API.products.detail(id), body),
  delete: (id: string) => apiClient.delete(API.products.detail(id)),
  submitForApproval: (id: string) =>
    apiClient.post<{ message: string }>(API.products.submit(id), {}),
  addVariant: (productId: string, body: VariantWriteBody) =>
    apiClient.post<ProductVariant>(API.products.variants(productId), body),
  updateVariant: (variantId: string, body: Partial<VariantWriteBody>) =>
    apiClient.patch<ProductVariant>(API.products.variant(variantId), body),
  deleteVariant: (variantId: string) =>
    apiClient.delete(API.products.variant(variantId)),
  addImage: (
    productId: string,
    body: { url: string; isPrimary?: boolean; variantId?: string | null },
  ) => apiClient.post<ProductImage>(API.products.images(productId), body),
  replaceImage: (imageId: string, body: { url: string; isPrimary?: boolean }) =>
    apiClient.patch<ProductImage>(API.products.image(imageId), body),
  deleteImage: (imageId: string) =>
    apiClient.delete(API.products.image(imageId)),
  setPrimaryImage: (imageId: string) =>
    apiClient.patch<{ message: string }>(
      API.products.imagePrimary(imageId),
      {},
    ),
};
