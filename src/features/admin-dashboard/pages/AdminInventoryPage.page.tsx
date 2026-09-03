"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { AdminDataPage } from "./AdminDataPage.page";
import { inventoryApi, type LowStockInventoryRow } from "../api/inventory.api";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

function StockEditor({
  row,
  reload,
}: {
  row: LowStockInventoryRow;
  reload: () => void;
}) {
  const [stock, setStock] = useState(String(row.stock));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    const nextStock = Number(stock);
    if (!Number.isInteger(nextStock) || nextStock < 0) {
      setError("Enter a whole number of zero or more.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      await inventoryApi.updateStock(row.id, nextStock);
      reload();
    } catch (saveError) {
      setError(getApiErrorMessage(saveError, "Could not update stock."));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex min-w-56 items-center justify-end gap-2">
      <Input
        aria-label={`Stock for ${row.sku}`}
        className="w-24"
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
        onClick={() => void save()}
      >
        <Save className="size-4" aria-hidden="true" />
        Save
      </Button>
      {error ? (
        <span className="max-w-40 text-body-sm text-danger">{error}</span>
      ) : null}
    </div>
  );
}

export function AdminInventoryPage() {
  return (
    <AdminDataPage
      title="Low-stock inventory"
      permission={[PERMISSIONS.PRODUCT_MANAGE, PERMISSIONS.PRODUCT_UPDATE]}
      load={() => inventoryApi.lowStock()}
      columnKeys={["productName", "sku", "stock", "lowStockAt"]}
      actions={(row, reload) => (
        <StockEditor row={row as LowStockInventoryRow} reload={reload} />
      )}
    />
  );
}
