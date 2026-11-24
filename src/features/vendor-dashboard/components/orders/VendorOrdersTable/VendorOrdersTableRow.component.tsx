import { memo } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { LABELS } from "@/shared/constants/labels";
import type { SubOrderRow } from "../../../types/orders/vendorOrders.types";
import { formatInr } from "../../../utils/orders/vendorOrderFormat";
import { SubOrderActions } from "./SubOrderActions.component";
import { ShipmentCell } from "./ShipmentCell.component";
import { ReturnsCell } from "./ReturnsCell.component";
import { VendorPackingSlipDialog } from "./VendorPackingSlipDialog.component";
import { VENDOR_ORDERS_TABLE_STYLES } from "../../../styles/orders/vendorOrdersTable.styles";

interface VendorOrdersTableRowProps {
  row: SubOrderRow;
  updatingId: string | null;
  statusError: string | null;
  onSetUpdatingId: (id: string | null) => void;
  onStatusChange: (id: string, status: string, trackingId?: string) => void;
}

export const VendorOrdersTableRow = memo(function VendorOrdersTableRow({
  row,
  updatingId,
  statusError,
  onSetUpdatingId,
  onStatusChange,
}: VendorOrdersTableRowProps) {
  const canDownloadInvoice = Boolean(row.subOrder.taxInvoiceNumber);
  const refCode = (
    row.subOrder.orderReference ?? row.subOrder.orderId.slice(0, 8)
  )
    .replace(/^#/, "")
    .toUpperCase();

  return (
    <TableRow>
      <TableCell className={VENDOR_ORDERS_TABLE_STYLES.cellDataOrder}>
        <div className="flex flex-col">
          <span className="font-semibold text-ink">{`#${refCode}`}</span>
          <span className="text-[11px] text-ink-muted">
            {row.subOrder.taxInvoiceNumber ?? LABELS.taxInvoiceAwaitingDispatch}
          </span>
        </div>
      </TableCell>
      <TableCell className={VENDOR_ORDERS_TABLE_STYLES.cellData}>
        <VendorPackingSlipDialog subOrder={row.subOrder} />
      </TableCell>
      <TableCell className={VENDOR_ORDERS_TABLE_STYLES.cellDataSubtotal}>
        {formatInr(row.subOrder.subtotal)}
      </TableCell>
      <TableCell className={VENDOR_ORDERS_TABLE_STYLES.cellData}>
        <StatusBadge status={row.subOrder.status} />
      </TableCell>
      <TableCell className={VENDOR_ORDERS_TABLE_STYLES.cellData}>
        <ShipmentCell row={row} />
      </TableCell>
      <TableCell className={VENDOR_ORDERS_TABLE_STYLES.cellData}>
        <ReturnsCell row={row} />
      </TableCell>
      <TableCell className={VENDOR_ORDERS_TABLE_STYLES.cellActions}>
        <SubOrderActions
          subOrderId={row.subOrder.id}
          status={row.subOrder.status}
          canDownloadInvoice={canDownloadInvoice}
          updatingId={updatingId}
          statusError={statusError}
          onSetUpdatingId={onSetUpdatingId}
          onStatusChange={onStatusChange}
        />
      </TableCell>
    </TableRow>
  );
});
