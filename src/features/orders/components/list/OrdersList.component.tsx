"use client";

import { motion } from "motion/react";
import { LABELS } from "@/shared/constants/labels";
import type { Order } from "@/shared/api/types";
import { DataTable } from "@/shared/components/DataTable.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { Button } from "@/shared/components/ui/button";
import { ContinueShoppingLink } from "@/shared/components/ContinueShoppingLink.component";
import { CustomerOrderHistoryPanel } from "@/features/reports";
import { ORDER_COLUMNS } from "./ordersTableColumns";
import { useOrdersList } from "./useOrdersList.hook";
import { ORDERS_LIST_STYLES } from "./ordersList.styles";

interface OrdersListProps {
  orders: Order[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    total: number;
    from: number;
    to: number;
    onPageChange: (page: number) => void;
  };
}

export function OrdersList({ orders, pagination }: OrdersListProps) {
  const { exportHistory, handleRowClick, getRowId, paginationConfig } =
    useOrdersList({ pagination });

  return (
    <div className={ORDERS_LIST_STYLES.root}>
      <div aria-hidden className={ORDERS_LIST_STYLES.radialBackground} />

      <div className={ORDERS_LIST_STYLES.container}>
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
          className={ORDERS_LIST_STYLES.header}
        >
          <div>
            <TextEyebrow brand>{LABELS.account}</TextEyebrow>
            <h1
              className={ORDERS_LIST_STYLES.heading}
              style={ORDERS_LIST_STYLES.headingStyle}
            >
              {LABELS.yourOrders}
            </h1>
            <p className={ORDERS_LIST_STYLES.description}>
              {LABELS.ordersPageHint}
            </p>
          </div>
          <div className={ORDERS_LIST_STYLES.headerActions}>
            <Button type="button" variant="outline" onClick={exportHistory}>
              {LABELS.exportOrderHistory}
            </Button>
            <ContinueShoppingLink />
          </div>
        </motion.header>

        <DataTable
          className={ORDERS_LIST_STYLES.tableMargin}
          columns={ORDER_COLUMNS}
          rows={orders}
          getRowId={getRowId}
          rowDetails={false}
          tableLayout="fixed"
          onRowClick={handleRowClick}
          pagination={paginationConfig}
        />

        <CustomerOrderHistoryPanel />
      </div>
    </div>
  );
}
