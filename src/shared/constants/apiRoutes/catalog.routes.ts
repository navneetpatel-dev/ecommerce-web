/** Frontend catalog API path builders — must stay aligned with backend mounts under `/api`. */
export const productsRoutes = {
  list: (query = "") => `/api/products${query ? `?${query}` : ""}`,
  detail: (id: string) => `/api/products/${id}`,
  bySlug: (slug: string) => `/api/products/slug/${slug}`,
  recentlyViewed: "/api/products/recently-viewed",
  frequentlyBoughtTogether: (id: string) =>
    `/api/products/${id}/frequently-bought-together`,
  bulkImport: "/api/products/bulk-import",
  approve: (id: string) => `/api/products/${id}/approve`,
  reject: (id: string) => `/api/products/${id}/reject`,
  archive: (id: string) => `/api/products/${id}/archive`,
  unarchive: (id: string) => `/api/products/${id}/unarchive`,
  submit: (id: string) => `/api/products/${id}/submit`,
  variants: (productId: string) => `/api/products/${productId}/variants`,
  variant: (variantId: string) => `/api/products/variants/${variantId}`,
  images: (productId: string) => `/api/products/${productId}/images`,
  image: (imageId: string) => `/api/products/images/${imageId}`,
  imagePrimary: (imageId: string) => `/api/products/images/${imageId}/primary`,
} as const;

export const categoriesRoutes = {
  list: "/api/categories",
  detail: (id: string) => `/api/categories/${id}`,
  resolve: (path: string) =>
    `/api/categories/resolve?path=${encodeURIComponent(path)}`,
  facets: (idOrSlug: string, query = "") =>
    `/api/categories/${idOrSlug}/facets${query ? `?${query}` : ""}`,
  productCount: (id: string) => `/api/categories/${id}/product-count`,
  reorder: "/api/categories/reorder",
  reassignProducts: "/api/categories/reassign-products",
  attributes: (categoryId: string) =>
    `/api/categories/${categoryId}/attributes`,
  attribute: (categoryId: string, attributeId: string) =>
    `/api/categories/${categoryId}/attributes/${attributeId}`,
  attributesReorder: (categoryId: string) =>
    `/api/categories/${categoryId}/attributes/reorder`,
} as const;
