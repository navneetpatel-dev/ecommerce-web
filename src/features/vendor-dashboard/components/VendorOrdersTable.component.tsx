"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/shared/components/ui/table";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { VendorStrip } from "@/shared/components/VendorStrip.component";
import { TableScrollShell } from "@/shared/components/TableScrollShell.component";
import { LABELS } from "@/shared/constants/labels";
import {
  TABLE_ACTIONS_CELL_CLASS,
  TABLE_ACTIONS_HEAD_CLASS,
  TABLE_DATA_CELL_CLASS,
  TABLE_PINNED_LAYOUT_CLASS,
} from "@/shared/constants/table";
import { cn } from "@/shared/utils/cn";
import type { SubOrderRow, VendorOrder } from "../types/vendorOrders.types";
import { formatInr, shortOrderId } from "./VendorOrdersTable/vendorOrderFormat";
import { SubOrderActions } from "./VendorOrdersTable/SubOrderActions.component";
import { VendorSubOrderCards } from "./VendorOrdersTable/VendorSubOrderCards.component";

export type { VendorOrder } from "../types/vendorOrders.types";

interface VendorOrdersTableProps {
  orders: VendorOrder[];
  updatingId: string | null;
  onSetUpdatingId: (id: string | null) => void;
  onStatusChange: (id: string, status: string) => void;
}

function flattenSubOrders(orders: VendorOrder[]): SubOrderRow[] {
  const rows: SubOrderRow[] = [];
  for (const order of orders) {
    for (const subOrder of order.subOrders ?? []) {
      rows.push({ orderId: order.id, subOrder });
    }
  }
  return rows;
}

const CARD_SHADOW_CLASS = "rounded-md border border-line bg-surface p-4";

/** Vendor order management table with inline status updates. */
export function VendorOrdersTable(props: VendorOrdersTableProps) {
  const { orders, updatingId, onSetUpdatingId, onStatusChange } = props;
  const rows = flattenSubOrders(orders);

  const renderActions = (subOrderId: string, canDownloadInvoice: boolean) => (
    <SubOrderActions
      subOrderId={subOrderId}
      canDownloadInvoice={canDownloadInvoice}
      updatingId={updatingId}
      onSetUpdatingId={onSetUpdatingId}
      onStatusChange={onStatusChange}
    />
  );

  const renderDesktopRow = (row: SubOrderRow) => (
    <TableRow key={row.subOrder.id}>
      <TableCell
        className={cn(TABLE_DATA_CELL_CLASS, "font-mono text-body-sm")}
      >
        {shortOrderId(row.orderId)}
      </TableCell>
      <TableCell className={TABLE_DATA_CELL_CLASS}>
        <VendorStrip vendor={row.subOrder.vendor} size="sm" />
      </TableCell>
      <TableCell className={cn(TABLE_DATA_CELL_CLASS, "font-mono")}>
        {formatInr(row.subOrder.subtotal)}
      </TableCell>
      <TableCell className={TABLE_DATA_CELL_CLASS}>
        <StatusBadge status={row.subOrder.status} />
      </TableCell>
      <TableCell className={TABLE_DATA_CELL_CLASS}>
        {row.subOrder.shipment ? (
          <div className="space-y-1">
            <StatusBadge status={row.subOrder.shipment.status} />
            {row.subOrder.shipment.deliveryAgent && (
              <p className="text-body-sm text-ink-muted">
                {row.subOrder.shipment.deliveryAgent.fullName}
              </p>
            )}
            {row.subOrder.shipment.proofOfDeliveryUrl && (
              <a
                href={row.subOrder.shipment.proofOfDeliveryUrl}
                target="_blank"
                rel="noreferrer"
                className="text-body-sm font-medium text-brand hover:underline"
              >
                View proof photo
              </a>
            )}
          </div>
        ) : (
          <span className="text-body-sm text-ink-muted">
            {LABELS.notShippedYet}
          </span>
        )}
      </TableCell>
      <TableCell className={TABLE_ACTIONS_CELL_CLASS}>
        {renderActions(row.subOrder.id, Boolean(row.subOrder.taxInvoiceNumber))}
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-[1.375rem] font-semibold text-ink">
        {LABELS.orderManagement}
      </h2>

      {rows.length === 0 ? (
        <div
          className={cn(
            CARD_SHADOW_CLASS,
            "px-4 py-14 text-center text-ink-muted",
          )}
        >
          {LABELS.noOrdersFound}
        </div>
      ) : (
        <>
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
              className={TABLE_PINNED_LAYOUT_CLASS}
            >
              <TableHeader>
                <TableRow>
                  <TableHead className={TABLE_DATA_CELL_CLASS}>
                    {LABELS.orderId}
                  </TableHead>
                  <TableHead className={TABLE_DATA_CELL_CLASS}>
                    {LABELS.vendorColumn}
                  </TableHead>
                  <TableHead className={TABLE_DATA_CELL_CLASS}>
                    {LABELS.subtotal}
                  </TableHead>
                  <TableHead className={TABLE_DATA_CELL_CLASS}>
                    {LABELS.status}
                  </TableHead>
                  <TableHead className={TABLE_DATA_CELL_CLASS}>
                    {LABELS.delivery}
                  </TableHead>
                  <TableHead className={TABLE_ACTIONS_HEAD_CLASS}>
                    {LABELS.actions}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{rows.map(renderDesktopRow)}</TableBody>
            </Table>
          </TableScrollShell>
        </>
      )}
    </div>
  );
}
