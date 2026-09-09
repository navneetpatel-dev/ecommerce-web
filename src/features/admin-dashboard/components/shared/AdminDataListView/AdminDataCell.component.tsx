import type { ReactNode } from "react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { TableCellImage } from "@/shared/components/TableCellImage.component";
import { extractImageUrls, isImageFieldKey } from "@/shared/utils/media/imageField";
import type { AdminDataRow } from "../../../hooks/shared/useAdminDataList.hook";
import {
  formatAdminCellValue,
  getAdminCellValue,
} from "../../../utils/shared/adminTableCells";
import { TableCellImagesList } from "./TableCellImagesList.component";

interface AdminDataCellProps {
  row: AdminDataRow;
  columnKey: string;
}

export function AdminDataCell({
  row,
  columnKey,
}: AdminDataCellProps): ReactNode {
  const value = getAdminCellValue(row, columnKey);

  if (isImageFieldKey(columnKey)) {
    const urls = extractImageUrls(value);
    if (urls.length === 1) {
      const alt =
        typeof row.name === "string"
          ? row.name
          : typeof row.businessName === "string"
            ? row.businessName
            : columnKey;
      return <TableCellImage src={urls[0]} alt={alt} />;
    }
    if (urls.length > 1) {
      return <TableCellImagesList urls={urls} alt={columnKey} />;
    }
  }

  if (columnKey === "status" || columnKey.endsWith(".status")) {
    if (typeof value === "string" && value.trim()) {
      return <StatusBadge status={value} />;
    }
    return formatAdminCellValue(value);
  }

  return formatAdminCellValue(value);
}
