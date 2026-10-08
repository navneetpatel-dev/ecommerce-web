"use client";

import type { ChangeEvent } from "react";
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

  const handleStockChange = (event: ChangeEvent<HTMLInputElement>) =>
    setStock(event.target.value.replace(/\D/g, ""));
  const handleSave = () => {
    void save(reload);
  };

  return (
    <div className={adminPagesStyles.stockEditorRow}>
      <Input
        aria-label={`Stock for ${row.sku}`}
        className={adminPagesStyles.stockEditorInput}
        type="text"
        inputMode="numeric"
        value={stock}
        onChange={handleStockChange}
      />
      <Button
        size="sm"
        variant="outline"
        loading={pending}
        onClick={handleSave}
      >
        <Save className={adminPagesStyles.iconSm} aria-hidden="true" />
        Save
      </Button>
      {error ? (
        <span role="alert" className={adminPagesStyles.stockEditorError}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
