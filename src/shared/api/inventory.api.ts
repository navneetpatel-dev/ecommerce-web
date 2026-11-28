import { apiClient } from "@/shared/api/client/client";
import {
  buildSearchParams,
  unwrapPaginatedList,
  type PaginatedList,
} from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";

type LowStockVariantResponse = {
  id: string;
  sku: string;
  stock: number;
  lowStockAt: number;
  product?: { name?: string | null } | null;
};

export type LowStockInventoryRow = {
  id: string;
  productName: string;
  sku: string;
  stock: number;
  lowStockAt: number;
};

function mapLowStockRow(row: LowStockVariantResponse): LowStockInventoryRow {
  return {
    id: row.id,
    productName: row.product?.name ?? "Unknown product",
    sku: row.sku,
    stock: Number(row.stock),
    lowStockAt: Number(row.lowStockAt),
  };
}

export type LowStockQuery = {
  page?: number;
  limit?: number;
  search?: string;
  level?: string;
  sort?: string;
};

/** Inventory endpoints used by admin and vendor dashboards. */
export const inventoryApi = {
  /** One page of variants at or under their alert level; the server filters and sorts. */
  lowStock: async (
    query: LowStockQuery = {},
  ): Promise<PaginatedList<LowStockInventoryRow>> => {
    const params = buildSearchParams({ ...query }).toString();
    const res = await apiClient.getWithResponse<LowStockVariantResponse[]>(
      params ? `${API.inventory.lowStock}?${params}` : API.inventory.lowStock,
    );
    const page = unwrapPaginatedList(res);
    return { ...page, items: page.items.map(mapLowStockRow) };
  },
  /** `expectedStock`: the stock the editor showed, so concurrent order changes survive. */
  updateStock: (variantId: string, stock: number, expectedStock?: number) =>
    apiClient.patch<LowStockVariantResponse>(
      API.inventory.variantStock(variantId),
      { stock, expectedStock },
    ),
};
