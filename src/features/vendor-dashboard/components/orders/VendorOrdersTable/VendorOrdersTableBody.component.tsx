import { memo } from "react";
import { TableBody } from "@/shared/components/ui/table";
import type { SubOrderRow } from "../../../types/orders/vendorOrders.types";
import { VendorOrdersTableRow } from "./VendorOrdersTableRow.component";

interface VendorOrdersTableBodyProps {
  rows: SubOrderRow[];
  updatingId: string | null;
  onSetUpdatingId: (id: string | null) => void;
  onStatusChange: (id: string, status: string, trackingId?: string) => void;
}

export const VendorOrdersTableBody = memo(function VendorOrdersTableBody({
  rows,
  updatingId,
  onSetUpdatingId,
  onStatusChange,
}: VendorOrdersTableBodyProps) {
  return (
    <TableBody>
      {rows.map((row) => (
        <VendorOrdersTableRow
          key={row.subOrder.id}
          row={row}
          updatingId={updatingId}
          onSetUpdatingId={onSetUpdatingId}
          onStatusChange={onStatusChange}
        />
      ))}
    </TableBody>
  );
});
