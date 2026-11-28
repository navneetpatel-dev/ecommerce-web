import { useVendorLowStock } from "./useVendorLowStock.hook";

const MAX_VISIBLE_ROWS = 6;

export function useVendorLowStockWidget() {
  const {
    rows: visible,
    matching,
    isLoading,
  } = useVendorLowStock(MAX_VISIBLE_ROWS);
  const remaining = matching - visible.length;
  const isEmpty = visible.length === 0;
  const hasRemaining = remaining > 0;

  return {
    visible,
    remaining,
    isEmpty,
    hasRemaining,
    isLoading,
  };
}
