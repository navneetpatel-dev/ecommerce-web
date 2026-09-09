import { useVendorLowStock } from "../../hooks/useVendorLowStock.hook";

const MAX_VISIBLE_ROWS = 6;

export function useVendorLowStockWidget() {
  const { rows, isLoading } = useVendorLowStock();
  const visible = rows.slice(0, MAX_VISIBLE_ROWS);
  const remaining = rows.length - visible.length;
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
