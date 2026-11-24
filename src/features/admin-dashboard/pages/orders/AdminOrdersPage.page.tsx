"use client";

import { useState } from "react";
import { AdminDataPage } from "../shared/AdminDataPage.page";
import { AdminOrdersFilters } from "../../components/orders/AdminOrdersFilters.component";
import { AdminOrderDetailDrawer } from "../../components/orders/AdminOrderDetailDrawer.component";
import { useAdminOrdersPage } from "../../hooks/orders/useAdminOrdersPage";
import { adminPagesStyles } from "../shared/adminPages.styles";
import type { AdminDataRow } from "../../hooks/shared/useAdminDataList.hook";
import type { Order } from "@/shared/api/types";

export function AdminOrdersPage() {
  const page = useAdminOrdersPage();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleRowClick = (row: AdminDataRow) => {
    setSelectedOrder(row as unknown as Order);
  };

  const handleCloseDrawer = () => {
    setSelectedOrder(null);
  };

  return (
    <div className={adminPagesStyles.stack6}>
      <AdminOrdersFilters {...page.filters} />
      <AdminDataPage
        title={page.title}
        permission={page.permission}
        load={page.load}
        actions={page.actions}
        columnKeys={page.columnKeys}
        onRowClick={handleRowClick}
      />
      {selectedOrder ? (
        <AdminOrderDetailDrawer
          order={selectedOrder}
          onClose={handleCloseDrawer}
        />
      ) : null}
    </div>
  );
}
