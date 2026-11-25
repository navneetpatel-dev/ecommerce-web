import type { ReactNode } from "react";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { TableCellImage } from "@/shared/components/DataTable/TableCellImage.component";
import {
  extractImageUrls,
  isImageFieldKey,
} from "@/shared/utils/media/imageField";
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
  if (columnKey === "product") {
    const title = String(row.name ?? row.productName ?? "—");
    const img =
      typeof row.imageUrl === "string" && row.imageUrl.trim()
        ? row.imageUrl.trim()
        : null;
    return (
      <div className="flex items-center gap-3 min-w-0">
        <TableCellImage src={img} alt={title} />
        <span className="truncate font-medium text-ink">{title}</span>
      </div>
    );
  }

  const value = getAdminCellValue(row, columnKey);

  if (isImageFieldKey(columnKey)) {
    const urls = extractImageUrls(value);
    const alt =
      typeof row.name === "string"
        ? row.name
        : typeof row.businessName === "string"
          ? row.businessName
          : columnKey;
    if (urls.length <= 1) {
      return <TableCellImage src={urls[0] ?? null} alt={alt} />;
    }
    return <TableCellImagesList urls={urls} alt={columnKey} />;
  }

  if (
    columnKey === "status" ||
    columnKey.endsWith(".status") ||
    columnKey.endsWith("Status")
  ) {
    if (typeof value === "string" && value.trim()) {
      return <StatusBadge status={value} />;
    }
    return formatAdminCellValue(value);
  }

  if (columnKey === "id" && typeof value === "string" && value.trim()) {
    const humanName =
      row.name ??
      row.businessName ??
      row.productName ??
      row.title ??
      row.customerName;
    return typeof humanName === "string" && humanName.trim() ? humanName : "—";
  }

  return formatAdminCellValue(value);
}
