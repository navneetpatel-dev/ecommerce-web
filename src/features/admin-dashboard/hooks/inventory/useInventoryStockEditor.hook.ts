"use client";

import { useState } from "react";
import { inventoryApi } from "../../api/inventory/inventory.api";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";

export function useInventoryStockEditor(
  currentStock: number,
  variantId: string,
) {
  const [stock, setStock] = useState(String(currentStock));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Called when the dialog opens: start from the stock the row shows now. */
  const reset = () => {
    setStock(String(currentStock));
    setError(null);
  };

  /** Saves; false when it did not (the message is in `error` and the dialog should stay). */
  const save = async (onSaved: () => void): Promise<boolean> => {
    const nextStock = Number(stock);
    if (!stock.trim() || !Number.isInteger(nextStock) || nextStock < 0) {
      setError(LABELS.variantStockRequired);
      return false;
    }
    setPending(true);
    setError(null);
    try {
      const saved = await inventoryApi.updateStock(
        variantId,
        nextStock,
        currentStock,
      );
      // Orders may have moved it meanwhile: say what it is now.
      notifySuccess(formatLabel(LABELS.stockNow, { count: saved.stock }));
      onSaved();
      return true;
    } catch (saveError) {
      setError(getApiErrorMessage(saveError, LABELS.couldNotUpdateStock));
      return false;
    } finally {
      setPending(false);
    }
  };

  return { stock, setStock, pending, error, reset, save };
}
