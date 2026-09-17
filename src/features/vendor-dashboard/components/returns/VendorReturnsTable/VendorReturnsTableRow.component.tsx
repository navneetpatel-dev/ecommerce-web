import { TableRow, TableCell } from "@/shared/components/ui/table";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { vendorReturnsTableStyles } from "../../../styles/returns/vendorReturnsTable.styles";
import type { VendorReturnRowViewModel } from "../../../hooks/returns/useVendorReturnsTablePresentation.hook";
import { VendorReturnPhotosCell } from "./VendorReturnPhotosCell.component";

interface VendorReturnsTableRowProps {
  row: VendorReturnRowViewModel;
}

export function VendorReturnsTableRow({ row }: VendorReturnsTableRowProps) {
  return (
    <TableRow>
      <TableCell className={vendorReturnsTableStyles.desktopCellBody}>
        {row.productLabel}
      </TableCell>
      <TableCell className={vendorReturnsTableStyles.desktopCellMuted}>
        {row.customerLabel}
      </TableCell>
      <TableCell className={vendorReturnsTableStyles.desktopCellBody}>
        {row.reasonLabel}
      </TableCell>
      <TableCell className={vendorReturnsTableStyles.desktopCell}>
        <VendorReturnPhotosCell
          images={row.images}
          productName={row.productLabel}
        />
      </TableCell>
      <TableCell className={vendorReturnsTableStyles.desktopCellMuted}>
        {row.pickupLabel}
      </TableCell>
      <TableCell className={vendorReturnsTableStyles.desktopCell}>
        <StatusBadge status={row.status} label={row.statusLabel} />
      </TableCell>
    </TableRow>
  );
}
