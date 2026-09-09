import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/shared/components/ui/table";
import { TableScrollShell } from "@/shared/components/TableScrollShell.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { BulkImportRowResult } from "@/features/products";
import { vendorBulkImportDialogStyles } from "../../styles/products/vendorDialogs.styles";

interface VendorBulkImportResultsTableProps {
  results: BulkImportRowResult[];
  successCount: number;
}

export function VendorBulkImportResultsTable({
  results,
  successCount,
}: VendorBulkImportResultsTableProps) {
  return (
    <div className={vendorBulkImportDialogStyles.stack}>
      <p className={vendorBulkImportDialogStyles.summaryText}>
        {formatLabel(LABELS.bulkImportSummary, {
          success: successCount,
          total: results.length,
        })}
      </p>
      <TableScrollShell>
        <Table scrollContainer={false}>
          <TableHeader>
            <TableRow>
              <TableHead>{LABELS.bulkImportRowColumn}</TableHead>
              <TableHead>{LABELS.bulkImportStatusColumn}</TableHead>
              <TableHead>{LABELS.bulkImportDetailColumn}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((row) => (
              <TableRow key={row.row}>
                <TableCell className={vendorBulkImportDialogStyles.rowCell}>
                  {row.row}
                </TableCell>
                <TableCell>
                  <Badge variant={row.success ? "success" : "destructive"}>
                    {row.success
                      ? LABELS.bulkImportRowSuccess
                      : LABELS.bulkImportRowFailed}
                  </Badge>
                </TableCell>
                <TableCell className={vendorBulkImportDialogStyles.detailCell}>
                  {row.success ? row.productId : row.error}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableScrollShell>
    </div>
  );
}
