import { memo } from "react";
import { TableBody, TableRow, TableCell } from "@/shared/components/ui/table";
import { LABELS } from "@/shared/constants/labels";
import { vendorReturnsTableStyles } from "../../../styles/returns/vendorReturnsTable.styles";
import type { VendorReturnRowViewModel } from "../../../hooks/returns/useVendorReturnsTablePresentation.hook";
import { VendorReturnsTableRow } from "./VendorReturnsTableRow.component";

interface VendorReturnsTableBodyProps {
  rows: VendorReturnRowViewModel[];
  isEmpty: boolean;
}

export const VendorReturnsTableBody = memo(function VendorReturnsTableBody({
  rows,
  isEmpty,
}: VendorReturnsTableBodyProps) {
  if (isEmpty) {
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={6}
            className={vendorReturnsTableStyles.desktopEmptyCell}
          >
            {LABELS.noReturnsYet}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {rows.map((row) => (
        <VendorReturnsTableRow key={row.id} row={row} />
      ))}
    </TableBody>
  );
});
