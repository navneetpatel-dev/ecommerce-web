"use client";

import { Save } from "lucide-react";
import type { LowStockInventoryRow } from "../../api/inventory/inventory.api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useInventoryStockEditor } from "../../hooks/inventory/useInventoryStockEditor.hook";
import { adminPagesStyles } from "../../pages/shared/adminPages.styles";

interface InventoryStockEditorProps {
  row: LowStockInventoryRow;
  reload: () => void;
}

export function InventoryStockEditor({
  row,
  reload,
}: InventoryStockEditorProps) {
  const { stock, setStock, pending, error, save } = useInventoryStockEditor(
    row.stock,
    row.id,
  );

  return (
    <div className={adminPagesStyles.stockEditorRow}>
      <Input
        aria-label={`Stock for ${row.sku}`}
        className={adminPagesStyles.stockEditorInput}
        min={0}
        step={1}
        type="number"
        value={stock}
        onChange={(event) => setStock(event.target.value)}
      />
      <Button
        size="sm"
        variant="outline"
        loading={pending}
        onClick={() => void save(reload)}
      >
        <Save className={adminPagesStyles.iconSm} aria-hidden="true" />
        Save
      </Button>
      {error ? (
        <span className={adminPagesStyles.stockEditorError}>{error}</span>
      ) : null}
    </div>
  );
}
