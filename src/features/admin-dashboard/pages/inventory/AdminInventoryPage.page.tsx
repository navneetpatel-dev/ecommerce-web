"use client";

import { AdminDataPage } from "../shared/AdminDataPage.page";
import {
  inventoryApi,
  type LowStockInventoryRow,
} from "../../api/inventory/inventory.api";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import type { AdminDataRow } from "../../hooks/shared/useAdminDataList.hook";
import { InventoryStockEditor } from "../../components/inventory/InventoryStockEditor.component";

function renderStockEditorAction(row: AdminDataRow, reload: () => void) {
  return (
    <InventoryStockEditor row={row as LowStockInventoryRow} reload={reload} />
  );
}

export function AdminInventoryPage() {
  return (
    <AdminDataPage
      title="Low-stock inventory"
      permission={[PERMISSIONS.PRODUCT_MANAGE, PERMISSIONS.PRODUCT_UPDATE]}
      load={() => inventoryApi.lowStock()}
      columnKeys={["productName", "sku", "stock", "lowStockAt"]}
      actions={renderStockEditorAction}
    />
  );
}
