"use client";

import { motion } from "motion/react";
import { LABELS } from "@/shared/constants/labels";
import type { Order } from "@/shared/api/types";
import { DataTable } from "@/shared/components/DataTable";
import { TextEyebrow } from "@/shared/components/display/TextEyebrow.component";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame } from "@/shared/components/forms";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { ORDER_STATUS } from "@/shared/constants/statuses";
import { formatStatusLabel } from "@/shared/utils/formatting/formatStatus";
import { ContinueShoppingLink } from "@/shared/components/navigation/ContinueShoppingLink.component";
import { CustomerOrderHistoryPanel } from "@/features/reports";
import { ORDER_COLUMNS } from "../../constants/list/ordersTableColumns";
import { useOrdersList } from "../../hooks/list/useOrdersList.hook";
import { ORDERS_LIST_STYLES } from "../../styles/list/ordersList.styles";

const ALL_STATUSES = "__ALL__";

interface OrdersListFilters {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
}

interface OrdersListProps {
  orders: Order[];
  filters?: OrdersListFilters;
  pagination?: {
    currentPage: number;
    totalPages: number;
    total: number;
    from: number;
    to: number;
    onPageChange: (page: number) => void;
  };
}

export function OrdersList({ orders, filters, pagination }: OrdersListProps) {
  const { exportHistory, handleRowClick, getRowId, paginationConfig } =
    useOrdersList({ pagination });

  const activeCount = filters
    ? (filters.search.trim() ? 1 : 0) +
      (filters.status && filters.status !== ALL_STATUSES ? 1 : 0)
    : 0;

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

        {filters && (
          <CollapsibleTableFilters
            activeCount={activeCount}
            onClear={filters.onClear}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
              <FormFieldFrame
                label={LABELS.search}
                htmlFor="customer-orders-search"
              >
                <Input
                  id="customer-orders-search"
                  value={filters.search}
                  onChange={(e) => filters.onSearchChange(e.target.value)}
                  placeholder={LABELS.searchOrdersPlaceholder}
                />
              </FormFieldFrame>

              <FormFieldFrame
                label={LABELS.status}
                htmlFor="customer-orders-status"
              >
                <Select
                  value={filters.status || ALL_STATUSES}
                  onValueChange={(val) =>
                    filters.onStatusChange(val === ALL_STATUSES ? "" : val)
                  }
                >
                  <SelectTrigger id="customer-orders-status">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_STATUSES}>All Statuses</SelectItem>
                    {Object.values(ORDER_STATUS).map((s) => (
                      <SelectItem key={s} value={s}>
                        {formatStatusLabel(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldFrame>

              {activeCount > 0 && (
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={filters.onClear}
                  >
                    {LABELS.clearFilters}
                  </Button>
                </div>
              )}
            </div>
          </CollapsibleTableFilters>
        )}

        <DataTable
          ariaLabel={LABELS.ordersTableAria}
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
