"use client";

import { useState, useCallback } from "react";
import { AdminDataPage } from "../shared/AdminDataPage.page";
import {
  inventoryApi,
  type LowStockInventoryRow,
} from "../../api/inventory/inventory.api";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import type { AdminDataRow } from "../../hooks/shared/useAdminDataList.hook";
import { InventoryStockEditor } from "../../components/inventory/InventoryStockEditor.component";
import { adminPagesStyles } from "../shared/adminPages.styles";

function renderStockEditorAction(row: AdminDataRow, reload: () => void) {
  return (
    <InventoryStockEditor row={row as LowStockInventoryRow} reload={reload} />
  );
}

export function AdminInventoryPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const load = useCallback(async () => {
    const rows = await inventoryApi.lowStock();
    if (!debouncedSearch) return rows;
    const q = debouncedSearch.toLowerCase();
    return rows.filter(
      (r) =>
        r.productName?.toLowerCase().includes(q) ||
        r.sku?.toLowerCase().includes(q),
    );
  }, [debouncedSearch]);

  const activeCount = search.trim() ? 1 : 0;
  const handleClear = () => setSearch("");
  const fetchDetail = useCallback(
    async (row: AdminDataRow) => ({ ...row }),
    [],
  );

  return (
    <div className={adminPagesStyles.stack6}>
      <CollapsibleTableFilters activeCount={activeCount} onClear={handleClear}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
          <FormFieldFrame
            label={LABELS.search}
            htmlFor="inventory-filter-search"
          >
            <Input
              id="inventory-filter-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name or SKU..."
            />
          </FormFieldFrame>
        </div>
      </CollapsibleTableFilters>

      <AdminDataPage
        title={LABELS.inventory}
        permission={[PERMISSIONS.PRODUCT_MANAGE, PERMISSIONS.PRODUCT_UPDATE]}
        load={load}
        columnKeys={["productName", "sku", "stock", "lowStockAt"]}
        actions={renderStockEditorAction}
        fetchRowDetail={fetchDetail}
      />
    </div>
  );
}
