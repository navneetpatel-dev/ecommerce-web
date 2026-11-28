"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { AdminDataPage } from "../shared/AdminDataPage.page";
import {
  inventoryApi,
  type LowStockInventoryRow,
} from "../../api/inventory/inventory.api";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
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
  const searchParams = useSearchParams();
  const paramSearch = searchParams.get("search") ?? searchParams.get("q") ?? "";
  const [userSearch, setUserSearch] = useState<string | null>(null);
  const [stockLevel, setStockLevel] = useState("");
  const [sort, setSort] = useState("");
  const search = userSearch ?? paramSearch;
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  // The server searches, filters, sorts and pages: the list can run to thousands of rows.
  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) =>
      inventoryApi.lowStock({
        page,
        limit,
        search: debouncedSearch || undefined,
        level: stockLevel || undefined,
        sort: sort || undefined,
      }),
    [debouncedSearch, stockLevel, sort],
  );

  const activeCount = [search.trim(), stockLevel, sort].filter(Boolean).length;
  const handleClear = () => {
    setUserSearch("");
    setStockLevel("");
    setSort("");
  };
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
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search by product name or SKU..."
            />
          </FormFieldFrame>

          <FormFieldFrame label="Stock Level" htmlFor="inventory-filter-stock">
            <Select
              value={stockLevel || "__ALL__"}
              onValueChange={(v) => setStockLevel(v === "__ALL__" ? "" : v)}
            >
              <SelectTrigger id="inventory-filter-stock">
                <SelectValue placeholder="All Low Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__ALL__">All Low Stock</SelectItem>
                <SelectItem value="OUT_OF_STOCK">Out of Stock (0)</SelectItem>
                <SelectItem value="CRITICAL">Critical (≤ 5 units)</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldFrame>

          <FormFieldFrame label="Sort By" htmlFor="inventory-filter-sort">
            <Select
              value={sort || "__ALL__"}
              onValueChange={(v) => setSort(v === "__ALL__" ? "" : v)}
            >
              <SelectTrigger id="inventory-filter-sort">
                <SelectValue placeholder="Default Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__ALL__">Default Order</SelectItem>
                <SelectItem value="stock_asc">Stock: Lowest First</SelectItem>
                <SelectItem value="stock_desc">Stock: Highest First</SelectItem>
                <SelectItem value="name_asc">Product Name (A–Z)</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldFrame>
        </div>
      </CollapsibleTableFilters>

      <AdminDataPage
        title={LABELS.inventory}
        permission={PERMISSIONS.PRODUCT_MANAGE}
        load={load}
        columnKeys={["productName", "sku", "stock", "lowStockAt"]}
        actions={renderStockEditorAction}
        fetchRowDetail={fetchDetail}
      />
    </div>
  );
}
