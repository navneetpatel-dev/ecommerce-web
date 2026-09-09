"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
} from "@/shared/components/ui/table";
import { TableScrollShell } from "@/shared/components/TableScrollShell.component";
import { LABELS } from "@/shared/constants/labels";
import type { VendorSubOrder } from "../../types/orders/vendorOrders.types";
import { VendorSubOrderCards } from "./VendorOrdersTable/VendorSubOrderCards.component";
import { VendorOrdersTableBody } from "./VendorOrdersTable/VendorOrdersTableBody.component";
import { useVendorOrdersTable } from "./VendorOrdersTable/useVendorOrdersTable.hook";
import { VENDOR_ORDERS_TABLE_STYLES } from "./VendorOrdersTable/vendorOrdersTable.styles";

export type { VendorSubOrder } from "../../types/orders/vendorOrders.types";

interface VendorOrdersTableProps {
  orders: VendorSubOrder[];
  updatingId: string | null;
  onSetUpdatingId: (id: string | null) => void;
  onStatusChange: (id: string, status: string, trackingId?: string) => void;
}

/** Vendor order management table with inline status updates. */
export function VendorOrdersTable(props: VendorOrdersTableProps) {
  const { orders, updatingId, onSetUpdatingId, onStatusChange } = props;
  const { rows, isEmpty, renderActions } = useVendorOrdersTable({
    orders,
    updatingId,
    onSetUpdatingId,
    onStatusChange,
  });

  if (isEmpty) {
    return (
      <div className={VENDOR_ORDERS_TABLE_STYLES.root}>
        <h2 className={VENDOR_ORDERS_TABLE_STYLES.heading}>
          {LABELS.orderManagement}
        </h2>
        <div className={VENDOR_ORDERS_TABLE_STYLES.emptyState}>
          {LABELS.noOrdersFound}
        </div>
      </div>
    );
  }

  return (
    <div className={VENDOR_ORDERS_TABLE_STYLES.root}>
      <h2 className={VENDOR_ORDERS_TABLE_STYLES.heading}>
        {LABELS.orderManagement}
      </h2>

      {/* Below lg: card list */}
      <VendorSubOrderCards
        rows={rows}
        updatingId={updatingId}
        renderActions={renderActions}
      />

      {/* lg+: scroll + pinned actions */}
      <TableScrollShell desktopOnly>
        <Table
          scrollContainer={false}
          className={VENDOR_ORDERS_TABLE_STYLES.tableLayout}
        >
          <TableHeader>
            <TableRow>
              <TableHead className={VENDOR_ORDERS_TABLE_STYLES.cellData}>
                {LABELS.orderId}
              </TableHead>
              <TableHead className={VENDOR_ORDERS_TABLE_STYLES.cellData}>
                {LABELS.vendorColumn}
              </TableHead>
              <TableHead className={VENDOR_ORDERS_TABLE_STYLES.cellData}>
                {LABELS.subtotal}
              </TableHead>
              <TableHead className={VENDOR_ORDERS_TABLE_STYLES.cellData}>
                {LABELS.status}
              </TableHead>
              <TableHead className={VENDOR_ORDERS_TABLE_STYLES.cellData}>
                {LABELS.delivery}
              </TableHead>
              <TableHead className={VENDOR_ORDERS_TABLE_STYLES.cellData}>
                {LABELS.returnPickup}
              </TableHead>
              <TableHead className={VENDOR_ORDERS_TABLE_STYLES.headActions}>
                {LABELS.actions}
              </TableHead>
            </TableRow>
          </TableHeader>
          <VendorOrdersTableBody
            rows={rows}
            updatingId={updatingId}
            onSetUpdatingId={onSetUpdatingId}
            onStatusChange={onStatusChange}
          />
        </Table>
      </TableScrollShell>
    </div>
  );
}
