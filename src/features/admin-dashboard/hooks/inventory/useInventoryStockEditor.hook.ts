"use client";

import { useState } from "react";
import { inventoryApi } from "../../api/inventory/inventory.api";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";

export function useInventoryStockEditor(currentStock: number, productId: string) {
  const [stock, setStock] = useState(String(currentStock));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (onSaved: () => void) => {
    const nextStock = Number(stock);
    if (!Number.isInteger(nextStock) || nextStock < 0) {
      setError("Enter a whole number of zero or more.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      await inventoryApi.updateStock(productId, nextStock);
      onSaved();
    } catch (saveError) {
      setError(getApiErrorMessage(saveError, "Could not update stock."));
    } finally {
      setPending(false);
    }
  };

  return { stock, setStock, pending, error, save };
}
