import { apiClient } from "@/shared/api/client/client";
import {
  unwrapPaginatedList,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";
import type {
  Category,
  CategoryAttribute,
  CategoryFacet,
} from "@/shared/api/types";
import type {
  CategoryImpact,
  CategoryRateChange,
  CategoryRateImpact,
  CategoryWriteBody,
} from "./categories.types";

export type {
  CategoryImpact,
  CategoryRateChange,
  CategoryRateImpact,
  CategoryWriteBody,
};

export const categoriesApi = {
  /** Storefront / pickers — full ACTIVE category tree (no pagination). */
  list: () => apiClient.get<Category[]>(API.categories.list),

  /**
   * Admin screens: the whole tree in order, a page at a time, every status, with depth, products,
   * subcategories and GST. (The public list is active categories only.)
   */
  listPaginated: async (
    params: PaginationQuery & {
      search?: string;
      status?: string;
      excludeId?: string;
    } = {},
  ): Promise<PaginatedList<Category>> => {
    const q = new URLSearchParams();
    q.set("page", String(params.page ?? 1));
    if (params.limit) q.set("limit", String(params.limit));
    if (params.search) q.set("search", params.search);
    if (params.status) q.set("status", params.status);
    if (params.excludeId) q.set("excludeId", params.excludeId);
    const res = await apiClient.getWithResponse<Category[]>(
      API.categories.admin(q.toString()),
    );
    return unwrapPaginatedList(res);
  },

  /** Pickers outside the category screens: active categories only, open to any signed-in admin. */
  listPublicPaginated: async (
    params: PaginationQuery & { search?: string } = {},
  ): Promise<PaginatedList<Category>> => {
    const q = new URLSearchParams();
    q.set("page", String(params.page ?? 1));
    if (params.limit) q.set("limit", String(params.limit));
    if (params.search) q.set("search", params.search);
    const res = await apiClient.getWithResponse<Category[]>(
      `${API.categories.list}?${q.toString()}`,
    );
    return unwrapPaginatedList(res);
  },

  /** Admin: one category with every status and field. */
  adminDetail: (id: string) =>
    apiClient.get<Category>(API.categories.adminDetail(id)),

  /** Admin: what archiving or deleting a category would touch. */
  impact: (id: string) =>
    apiClient.get<CategoryImpact>(API.categories.impact(id)),

  /** Admin: move among siblings and/or under another parent. */
  move: (
    id: string,
    body: { parentId?: string | null; beforeId?: string; afterId?: string },
  ) =>
    apiClient.patch<{ id: string; orderedIds: string[] }>(
      API.categories.move(id),
      body,
    ),

  detail: (id: string) => apiClient.get<Category>(API.categories.detail(id)),

  resolvePath: (path: string) =>
    apiClient.get<Category>(API.categories.resolve(path)),

  facets: (idOrSlug: string, selected: Record<string, string[]> = {}) => {
    const q = new URLSearchParams();
    for (const [key, values] of Object.entries(selected)) {
      if (values.length) q.set(key, values.join(","));
    }
    return apiClient.get<{ categoryId: string; facets: CategoryFacet[] }>(
      API.categories.facets(idOrSlug, q.toString()),
    );
  },

  productCount: (id: string) =>
    apiClient.get<{ categoryId: string; productCount: number }>(
      API.categories.productCount(id),
    ),

  create: (body: CategoryWriteBody) =>
    apiClient.post<Category>(API.categories.list, body),

  update: (id: string, body: CategoryWriteBody) =>
    apiClient.patch<Category>(API.categories.detail(id), body),

  reorder: (orderedIds: string[]) =>
    apiClient.patch<{ orderedIds: string[] }>(API.categories.reorder, {
      orderedIds,
    }),

  /** Admin: what a new commission rate or parent would charge vendor products differently. */
  rateImpact: (change: CategoryRateChange) =>
    apiClient.get<CategoryRateImpact>(
      API.categories.rateImpact(
        new URLSearchParams(
          Object.entries(change).filter((entry): entry is [string, string] =>
            Boolean(entry[1]),
          ),
        ).toString(),
      ),
    ),

  delete: (id: string) => apiClient.delete(API.categories.detail(id)),

  listAttributes: (categoryId: string) =>
    apiClient.get<CategoryAttribute[]>(API.categories.attributes(categoryId)),

  createAttribute: (
    categoryId: string,
    body: {
      name: string;
      type: string;
      options?: unknown[];
      displayOrder?: number;
    },
  ) =>
    apiClient.post<CategoryAttribute>(
      API.categories.attributes(categoryId),
      body,
    ),

  updateAttribute: (
    categoryId: string,
    attributeId: string,
    body: {
      name?: string;
      type?: string;
      options?: unknown[];
      displayOrder?: number;
    },
  ) =>
    apiClient.patch<CategoryAttribute>(
      API.categories.attribute(categoryId, attributeId),
      body,
    ),

  reorderAttributes: (categoryId: string, orderedIds: string[]) =>
    apiClient.patch<{ orderedIds: string[] }>(
      API.categories.attributesReorder(categoryId),
      {
        orderedIds,
      },
    ),

  deleteAttribute: (categoryId: string, attributeId: string) =>
    apiClient.delete(API.categories.attribute(categoryId, attributeId)),
};
