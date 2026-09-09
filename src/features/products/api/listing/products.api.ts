import { apiClient } from "@/shared/api/client/client";
import { postFile } from "@/shared/api/client/postFile";
import { unwrapPaginatedList } from "@/shared/api/client/pagination";
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
  sort?: string;
  page?: number;
  limit?: number;
  status?: string;
  includeDescendants?: boolean;
  excludeProductId?: string;
  /** Attribute facet selections: filterKey → values (OR within key). */
  attrs?: Record<string, string[]>;
}

export interface ProductListResponse {
  items: ProductListItem[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export const productsApi = {
  list: async (filters: ProductFilters): Promise<ProductListResponse> => {
    const params = new URLSearchParams();
    if (filters.categoryId) params.set("categoryId", filters.categoryId);
    if (filters.vendorId) params.set("vendorId", filters.vendorId);
    if (filters.search) params.set("search", filters.search);
    if (filters.minPrice != null)
      params.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice != null)
      params.set("maxPrice", String(filters.maxPrice));
    if (filters.rating != null) params.set("rating", String(filters.rating));
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));
    if (filters.status) params.set("status", filters.status);
    if (filters.includeDescendants) params.set("includeDescendants", "true");
    if (filters.excludeProductId)
      params.set("excludeProductId", filters.excludeProductId);
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
  /** Vendor-scoped CSV bulk import — one row per product, text/numeric fields only. */
  bulkImport: (file: File) =>
    postFile<BulkImportRowResult[]>(API.products.bulkImport, file),
  update: (id: string, body: Partial<ProductWriteBody>) =>
    apiClient.patch<ProductDetail>(API.products.detail(id), body),
  delete: (id: string) => apiClient.delete(API.products.detail(id)),
  submitForApproval: (id: string) =>
    apiClient.post<{ message: string }>(API.products.submit(id), {}),
  addVariant: (
    productId: string,
    body: {
      sku: string;
      attributes: Record<string, string>;
      price: number;
      stock: number;
    },
  ) => apiClient.post<ProductVariant>(API.products.variants(productId), body),
  updateVariant: (
    variantId: string,
    body: Partial<{
      attributes: Record<string, string>;
      price: number;
      stock: number;
    }>,
  ) => apiClient.patch<ProductVariant>(API.products.variant(variantId), body),
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
