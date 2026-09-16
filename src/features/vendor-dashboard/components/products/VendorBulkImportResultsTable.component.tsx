import { Badge } from "@/shared/components/ui/badge";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { BulkImportRowResult } from "@/features/products";
import { vendorBulkImportDialogStyles } from "../../styles/products/vendorDialogs.styles";

interface VendorBulkImportResultsTableProps {
  results: BulkImportRowResult[];
  successCount: number;
}

const COLUMNS: DataTableColumn<BulkImportRowResult>[] = [
  {
    id: "row",
    header: LABELS.bulkImportRowColumn,
    className: vendorBulkImportDialogStyles.rowCell,
    accessor: "row",
  },
  {
    id: "status",
    header: LABELS.bulkImportStatusColumn,
    truncate: false,
    cell: (row) => (
      <Badge variant={row.success ? "success" : "destructive"}>
        {row.success ? LABELS.bulkImportRowSuccess : LABELS.bulkImportRowFailed}
      </Badge>
    ),
  },
  {
    id: "detail",
    header: LABELS.bulkImportDetailColumn,
    className: vendorBulkImportDialogStyles.detailCell,
    cell: (row) => (row.success ? row.productId : row.error),
  },
];

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
      <DataTable
        columns={COLUMNS}
        rows={results}
        getRowId={(row, index) => `${row.row}-${index}`}
        emptyMessage={LABELS.noRecordsFound}
        rowDetails={false}
      />
    </div>
  );
}
