import { apiClient } from "@/shared/api/client";
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

export const inventoryApi = {
  lowStock: async (): Promise<LowStockInventoryRow[]> => {
    const rows = await apiClient.get<LowStockVariantResponse[]>(
      API.inventory.lowStock,
    );
    return rows.map((row) => ({
      id: row.id,
      productName: row.product?.name ?? "Unknown product",
      sku: row.sku,
      stock: Number(row.stock),
      lowStockAt: Number(row.lowStockAt),
    }));
  },
  updateStock: (variantId: string, stock: number) =>
    apiClient.patch<LowStockVariantResponse>(
      API.inventory.variantStock(variantId),
      { stock },
    ),
};
