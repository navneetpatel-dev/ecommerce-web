"use client";

import { useMemo } from "react";
import { Download } from "lucide-react";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { earningsPayoutsCardStyles } from "../../../styles/earnings/earningsPayoutsCard.styles";
import type { PayoutTableRowViewModel } from "../../../hooks/earnings/useEarningsPayoutsCardPresentation.hook";

interface EarningsPayoutsTableProps {
  rows: PayoutTableRowViewModel[];
  downloadingId: string | null;
  onDownload: (id: string) => Promise<void>;
}

export function EarningsPayoutsTable({
  rows,
  downloadingId,
  onDownload,
}: EarningsPayoutsTableProps) {
  const columns = useMemo<DataTableColumn<PayoutTableRowViewModel>[]>(
    () => [
      {
        id: "period",
        header: "Period",
        accessor: "periodLabel",
      },
      {
        id: "amount",
        header: "Amount",
        className: earningsPayoutsCardStyles.cellMono,
        accessor: "amountLabel",
      },
      {
        id: "status",
        header: "Status",
        cell: (row) => <StatusBadge status={row.status} />,
      },
      {
        id: "reference",
        header: "Reference",
        accessor: "referenceLabel",
      },
      {
        id: "statement",
        header: "Statement",
        truncate: false,
        cell: (row) => (
          <button
            type="button"
            className={earningsPayoutsCardStyles.downloadButton}
            disabled={downloadingId === row.id}
            onClick={() => {
              void onDownload(row.id);
            }}
          >
            <Download
              className={earningsPayoutsCardStyles.downloadIcon}
              aria-hidden="true"
            />
            PDF
          </button>
        ),
      },
    ],
    [downloadingId, onDownload],
  );

  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      rowDetails={false}
    />
  );
}
