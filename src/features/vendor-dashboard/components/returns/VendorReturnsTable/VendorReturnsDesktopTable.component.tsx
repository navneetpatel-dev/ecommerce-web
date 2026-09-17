import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
} from "@/shared/components/ui/table";
import { TableScrollShell } from "@/shared/components/TableScrollShell.component";
import { LABELS } from "@/shared/constants/labels";
import { vendorReturnsTableStyles } from "../../../styles/returns/vendorReturnsTable.styles";
import { VendorReturnsTableBody } from "./VendorReturnsTableBody.component";
import type { VendorReturnRowViewModel } from "../../../hooks/returns/useVendorReturnsTablePresentation.hook";

interface VendorReturnsDesktopTableProps {
  rows: VendorReturnRowViewModel[];
  isEmpty: boolean;
}

export function VendorReturnsDesktopTable({
  rows,
  isEmpty,
}: VendorReturnsDesktopTableProps) {
  return (
    <TableScrollShell desktopOnly>
      <Table scrollContainer={false}>
        <TableHeader>
          <TableRow>
            <TableHead className={vendorReturnsTableStyles.desktopCell}>
              {LABELS.productName}
            </TableHead>
            <TableHead className={vendorReturnsTableStyles.desktopCell}>
              {LABELS.customerName}
            </TableHead>
            <TableHead className={vendorReturnsTableStyles.desktopCell}>
              {LABELS.returnReasonLabel}
            </TableHead>
            <TableHead className={vendorReturnsTableStyles.desktopCell}>
              {LABELS.returnPhotos}
            </TableHead>
            <TableHead className={vendorReturnsTableStyles.desktopCell}>
              {LABELS.returnTimelineLogisticsTrack}
            </TableHead>
            <TableHead className={vendorReturnsTableStyles.desktopCell}>
              {LABELS.status}
            </TableHead>
          </TableRow>
        </TableHeader>
        <VendorReturnsTableBody rows={rows} isEmpty={isEmpty} />
      </Table>
    </TableScrollShell>
  );
}
