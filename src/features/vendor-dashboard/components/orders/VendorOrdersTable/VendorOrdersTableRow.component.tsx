import { memo } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { VendorStrip } from "@/shared/components/VendorStrip.component";
import type { SubOrderRow } from "../../../types/orders/vendorOrders.types";
import { formatInr, shortOrderId } from "./vendorOrderFormat";
import { SubOrderActions } from "./SubOrderActions.component";
import { ShipmentCell } from "./ShipmentCell.component";
import { ReturnsCell } from "./ReturnsCell.component";
import { VENDOR_ORDERS_TABLE_STYLES } from "./vendorOrdersTable.styles";

interface VendorOrdersTableRowProps {
  row: SubOrderRow;
  updatingId: string | null;
  onSetUpdatingId: (id: string | null) => void;
  onStatusChange: (id: string, status: string, trackingId?: string) => void;
}

export const VendorOrdersTableRow = memo(function VendorOrdersTableRow({
  row,
  updatingId,
  onSetUpdatingId,
  onStatusChange,
}: VendorOrdersTableRowProps) {
  const canDownloadInvoice = Boolean(row.subOrder.taxInvoiceNumber);

  return (
    <TableRow>
      <TableCell className={VENDOR_ORDERS_TABLE_STYLES.cellDataOrder}>
        {shortOrderId(row.orderId)}
      </TableCell>
      <TableCell className={VENDOR_ORDERS_TABLE_STYLES.cellData}>
        <VendorStrip vendor={row.subOrder.vendor} size="sm" />
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
          canDownloadInvoice={canDownloadInvoice}
          updatingId={updatingId}
          onSetUpdatingId={onSetUpdatingId}
          onStatusChange={onStatusChange}
        />
      </TableCell>
    </TableRow>
  );
});
