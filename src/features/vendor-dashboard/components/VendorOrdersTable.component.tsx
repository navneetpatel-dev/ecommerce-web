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
import type { SubOrderRow, VendorSubOrder } from "../types/vendorOrders.types";
import { formatInr, shortOrderId } from "./VendorOrdersTable/vendorOrderFormat";
import { SubOrderActions } from "./VendorOrdersTable/SubOrderActions.component";
import { VendorSubOrderCards } from "./VendorOrdersTable/VendorSubOrderCards.component";

export type { VendorSubOrder } from "../types/vendorOrders.types";

interface VendorOrdersTableProps {
  orders: VendorSubOrder[];
  updatingId: string | null;
  onSetUpdatingId: (id: string | null) => void;
  onStatusChange: (id: string, status: string, trackingId?: string) => void;
}

// The backend returns a flat list of sub-orders (each carrying its own
// orderId), not orders grouped with nested sub-orders — one row per sub-order.
function flattenSubOrders(orders: VendorSubOrder[]): SubOrderRow[] {
  return orders.map((subOrder) => ({ orderId: subOrder.orderId, subOrder }));
}

const CARD_SHADOW_CLASS = "rounded-md border border-line bg-surface p-4";

function renderShipmentCell(row: SubOrderRow) {
  const shipment = row.subOrder.shipment;
  if (!shipment) {
    return (
      <span className="text-body-sm text-ink-muted">
        {LABELS.notShippedYet}
      </span>
    );
  }

  const deliveryAgentName = shipment.deliveryAgent ? (
    <p className="text-body-sm text-ink-muted">
      {shipment.deliveryAgent.fullName}
    </p>
  ) : null;

  const hasCodAmount = shipment.codAmount != null;
  const codCollectedLabel = shipment.codCollected ? "(collected)" : "(due)";
  const codLine = hasCodAmount ? (
    <p className="text-body-sm text-ink-muted">
      COD: {formatInr(shipment.codAmount as number)} {codCollectedLabel}
    </p>
  ) : null;

  const proofLink = shipment.proofOfDeliveryUrl ? (
    <a
      href={shipment.proofOfDeliveryUrl}
      target="_blank"
      rel="noreferrer"
      className="text-body-sm font-medium text-brand hover:underline"
    >
      View proof photo
    </a>
  ) : null;

  return (
    <div className="space-y-1">
      <StatusBadge status={shipment.status} />
      {deliveryAgentName}
      {codLine}
      {proofLink}
    </div>
  );
}

function renderReturnsCell(row: SubOrderRow) {
  const returnRequests = row.subOrder.returnRequests ?? [];
  if (returnRequests.length === 0) {
    return (
      <span className="text-body-sm text-ink-muted">
        {LABELS.noReturnOrExchange}
      </span>
    );
  }

  const returnRows = returnRequests.map((returnRequest) => {
    const agentName = returnRequest.deliveryAgent ? (
      <p className="text-body-sm text-ink-muted">
        {returnRequest.deliveryAgent.fullName}
      </p>
    ) : null;
    return (
      <div key={returnRequest.id} className="flex items-center gap-2">
        <StatusBadge status={returnRequest.status} />
        {agentName}
      </div>
    );
  });

  return <div className="space-y-1">{returnRows}</div>;
}

/** Vendor order management table with inline status updates. */
export function VendorOrdersTable(props: VendorOrdersTableProps) {
  const { orders, updatingId, onSetUpdatingId, onStatusChange } = props;
  const rows = flattenSubOrders(orders);
  const isEmpty = rows.length === 0;

  const renderActions = (subOrderId: string, canDownloadInvoice: boolean) => (
    <SubOrderActions
      subOrderId={subOrderId}
      canDownloadInvoice={canDownloadInvoice}
      updatingId={updatingId}
      onSetUpdatingId={onSetUpdatingId}
      onStatusChange={onStatusChange}
    />
  );

  const renderDesktopRow = (row: SubOrderRow) => {
    const shipmentCell = renderShipmentCell(row);
    const returnsCell = renderReturnsCell(row);
    const actionsCell = renderActions(
      row.subOrder.id,
      Boolean(row.subOrder.taxInvoiceNumber),
    );

    return (
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
        <TableCell className={TABLE_DATA_CELL_CLASS}>{shipmentCell}</TableCell>
        <TableCell className={TABLE_DATA_CELL_CLASS}>{returnsCell}</TableCell>
        <TableCell className={TABLE_ACTIONS_CELL_CLASS}>
          {actionsCell}
        </TableCell>
      </TableRow>
    );
  };

  const emptyState = (
    <div
      className={cn(CARD_SHADOW_CLASS, "px-4 py-14 text-center text-ink-muted")}
    >
      {LABELS.noOrdersFound}
    </div>
  );

  const desktopRows = rows.map(renderDesktopRow);

  const tableContent = (
    <>
      {/* Below lg: card list */}
      <VendorSubOrderCards
        rows={rows}
        updatingId={updatingId}
        renderActions={renderActions}
      />

      {/* lg+: scroll + pinned actions */}
      <TableScrollShell desktopOnly>
        <Table scrollContainer={false} className={TABLE_PINNED_LAYOUT_CLASS}>
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
              <TableHead className={TABLE_DATA_CELL_CLASS}>
                {LABELS.returnPickup}
              </TableHead>
              <TableHead className={TABLE_ACTIONS_HEAD_CLASS}>
                {LABELS.actions}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{desktopRows}</TableBody>
        </Table>
      </TableScrollShell>
    </>
  );

  const body = isEmpty ? emptyState : tableContent;

  return (
    <div className="space-y-4">
      <h2 className="text-[1.375rem] font-semibold text-ink">
        {LABELS.orderManagement}
      </h2>
      {body}
    </div>
  );
}
