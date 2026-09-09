import { apiClient } from "@/shared/api/client/client";
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

/** Inventory endpoints used by admin and vendor dashboards. */
export const inventoryApi = {
  lowStock: async (): Promise<LowStockInventoryRow[]> => {
    const rows = await apiClient.get<LowStockVariantResponse[]>(
      API.inventory.lowStock,
    );
    return rows.map(mapLowStockRow);
  },
  updateStock: (variantId: string, stock: number) =>
    apiClient.patch<LowStockVariantResponse>(
      API.inventory.variantStock(variantId),
      { stock },
    ),
};
