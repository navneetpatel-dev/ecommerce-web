import { useMemo, type ReactNode } from "react";
import type { DataTableColumn } from "@/shared/components/DataTable.component";
import { LABELS } from "@/shared/constants/labels";
import { isImageFieldKey } from "@/shared/utils/media/imageField";
import {
  inferAdminColumns,
  type AdminDataRow,
} from "./useAdminDataList.hook";
import { AdminDataCell } from "../../components/shared/AdminDataListView/AdminDataCell.component";

function columnHeader(key: string): string {
  const leaf = key.includes(".") ? key.split(".").pop()! : key;
  const labels = LABELS as Record<string, string>;
  return labels[leaf] ?? labels[key] ?? leaf;
}

export function useAdminDataListView(
  rows: AdminDataRow[],
  columnKeys?: string[],
  actions?: (row: AdminDataRow, reload: () => void) => ReactNode,
  onRefresh?: () => void,
) {
  const keys = useMemo(
    () => columnKeys ?? inferAdminColumns(rows),
    [columnKeys, rows],
  );

  const columns: DataTableColumn<AdminDataRow>[] = useMemo(
    () =>
      keys.map((key) => ({
        id: key,
        header: columnHeader(key),
        truncate:
          key !== "status" && !key.endsWith(".status") && !isImageFieldKey(key),
        cell: (row) => <AdminDataCell row={row} columnKey={key} />,
      })),
    [keys],
  );

  const getRowId = (row: AdminDataRow, index: number) =>
    String(row.id ?? index);

  const renderActions =
    actions && onRefresh
      ? (row: AdminDataRow) => actions(row, onRefresh)
      : undefined;

  return {
    columns,
    getRowId,
    renderActions,
  };
}
