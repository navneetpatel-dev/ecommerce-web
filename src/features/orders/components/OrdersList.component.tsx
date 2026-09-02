"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import type { Order } from "@/shared/api/types";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { Button } from "@/shared/components/ui/button";
import { ContinueShoppingLink } from "@/shared/components/ContinueShoppingLink.component";
import { navigate } from "@/shared/utils/navigate";
import { OrderStatusGroup } from "./OrderStatusGroup.component";
import {
  countOrderItems,
  formatInr,
  formatOrderDate,
  orderItemSummary,
  shortOrderId,
} from "../utils/format";
import { reportsEngineApi } from "@/features/reports";
import { CustomerOrderHistoryPanel } from "@/features/reports";

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

function defaultHistoryRange() {
  const to = new Date();
  const from = new Date();
  from.setFullYear(to.getFullYear() - 2);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

const ORDER_COLUMNS: DataTableColumn<Order>[] = [
  {
    id: "order",
    header: LABELS.ordersColumnOrder,
    headerClassName: "w-[10%]",
    className: "w-[10%] font-mono text-body-sm",
    truncate: false,
    cell: (order) => `#${shortOrderId(order.id)}`,
  },
  {
    id: "placed",
    header: LABELS.ordersColumnPlaced,
    headerClassName: "w-[12%]",
    className: "w-[12%] text-ink-muted",
    cell: (order) => formatOrderDate(order.createdAt),
  },
  {
    id: "items",
    header: LABELS.ordersColumnItems,
    headerClassName: "w-[38%]",
    className: "w-[38%]",
    truncate: false,
    cell: (order) => {
      const itemCount = countOrderItems(order);
      const vendorCount = order.subOrders?.length ?? 0;
      return (
        <div className="min-w-0">
          <p className="truncate text-body text-ink group-hover:text-brand">
            {orderItemSummary(order)}
          </p>
          <p className="mt-0.5 text-[0.75rem] text-ink-faint">
            {vendorCount}{" "}
            {vendorCount === 1 ? LABELS.sellerSingular : LABELS.sellerPlural}
            {" · "}
            {itemCount}{" "}
            {itemCount === 1 ? LABELS.itemSingular : LABELS.itemPlural}
          </p>
        </div>
      );
    },
  },
  {
    id: "total",
    header: LABELS.ordersColumnTotal,
    headerClassName: "w-[14%] text-right",
    className: "w-[14%] text-right",
    cell: (order) => (
      <span className="font-display text-[1.125rem] tabular-nums text-ink">
        {formatInr(order.totalAmount)}
      </span>
    ),
  },
  {
    id: "status",
    header: LABELS.ordersColumnStatus,
    headerClassName: "w-[22%]",
    className: "w-[22%]",
    truncate: false,
    cell: (order) => (
      <OrderStatusGroup
        orderStatus={order.status}
        paymentStatus={order.paymentStatus}
        density="compact"
      />
    ),
  },
  {
    id: "open",
    header: <span className="sr-only">{LABELS.ordersColumnOpen}</span>,
    headerClassName: "w-[4%]",
    className: "w-[4%] text-right",
    hideOnMobile: true,
    truncate: false,
    cell: () => (
      <ChevronRight
        className="ml-auto h-4 w-4 text-ink-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand"
        strokeWidth={1.5}
        aria-hidden
      />
    ),
  },
];

export function OrdersList({ orders, pagination }: OrdersListProps) {
  const router = useRouter();
  const exportHistory = () => {
    const range = defaultHistoryRange();
    void reportsEngineApi.customerOrderHistoryExport(range);
  };
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
      />

      <div className="storefront-container relative py-6 md:py-8">
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <TextEyebrow brand>{LABELS.account}</TextEyebrow>
            <h1
              className="mt-1.5 font-display text-ink leading-[1.1] tracking-tight"
              style={{ fontSize: "var(--text-display-sm)" }}
            >
              {LABELS.yourOrders}
            </h1>
            <p className="mt-2 max-w-xl text-body text-ink-muted">
              {LABELS.ordersPageHint}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline" onClick={exportHistory}>
              {LABELS.exportOrderHistory}
            </Button>
            <ContinueShoppingLink />
          </div>
        </motion.header>

        <DataTable
          className="mt-8"
          columns={ORDER_COLUMNS}
          rows={orders}
          getRowId={(order) => order.id}
          rowDetails={false}
          tableLayout="fixed"
          onRowClick={(order) => navigate(router, PATHS.order(order.id))}
          pagination={
            pagination
              ? {
                  page: pagination.currentPage,
                  totalPages: pagination.totalPages,
                  total: pagination.total,
                  from: pagination.from,
                  to: pagination.to,
                  onPageChange: pagination.onPageChange,
                }
              : undefined
          }
        />

        <CustomerOrderHistoryPanel />
      </div>
    </div>
  );
}
