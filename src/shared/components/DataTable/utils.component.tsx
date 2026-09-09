"use client";

import type { ReactNode } from "react";
import { TableCellImage } from "@/shared/components/TableCellImage.component";
import { TruncatedText } from "@/shared/components/TruncatedText.component";
import { TABLE_CELL_MAX_CHARS } from "@/shared/constants/table/table";
import { extractImageUrls, isImageFieldKey } from "@/shared/utils/media/imageField";
import { tryFormatDateTime } from "@/shared/utils/formatting/formatDate";
import { dataTableUtilsStyles } from "./dataTable.styles";
import type { DataTableColumn } from "./types";

export function columnFieldKey<T>(column: DataTableColumn<T>): string {
  return column.accessor != null ? String(column.accessor) : column.id;
}

export function columnLabel<T>(column: DataTableColumn<T>): string {
  if (column.mobileLabel) return column.mobileLabel;
  if (typeof column.header === "string" || typeof column.header === "number") {
    return String(column.header);
  }
  return column.id;
}

function imageAltFromRow<T>(row: T, column: DataTableColumn<T>): string {
  if (row != null && typeof row === "object") {
    const record = row as Record<string, unknown>;
    for (const key of ["name", "title", "businessName", "code", "slug"]) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  }
  return columnLabel(column);
}

export function resolveCell<T>(
  column: DataTableColumn<T>,
  row: T,
  index: number,
): ReactNode {
  if (column.cell) {
    const content = column.cell(row, index);
    if (typeof content === "string" || typeof content === "number") {
      const asDate = tryFormatDateTime(content);
      if (asDate) return asDate;
    }
    return content;
  }
  if (column.accessor != null) {
    const value = row[column.accessor];
    if (value == null || value === "") return "—";
    const fieldKey = String(column.accessor);
    if (isImageFieldKey(fieldKey)) {
      return value as ReactNode;
    }
    const asDate = tryFormatDateTime(value);
    if (asDate) return asDate;
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  }
  return "—";
}

export function renderCellContent<T>(
  column: DataTableColumn<T>,
  content: ReactNode,
  row: T,
): ReactNode {
  const fieldKey = columnFieldKey(column);
  if (!column.cell && isImageFieldKey(fieldKey)) {
    const urls = extractImageUrls(content);
    if (urls.length === 1) {
      return (
        <TableCellImage src={urls[0]} alt={imageAltFromRow(row, column)} />
      );
    }
    if (urls.length > 1) {
      return (
        <div className={dataTableUtilsStyles.imagesWrap}>
          {urls.slice(0, 4).map((url) => (
            <TableCellImage
              key={url}
              src={url}
              alt={imageAltFromRow(row, column)}
            />
          ))}
          {urls.length > 4 ? (
            <span className={dataTableUtilsStyles.imagesOverflow}>
              +{urls.length - 4}
            </span>
          ) : null}
        </div>
      );
    }
  }

  const shouldTruncate =
    column.truncate !== false &&
    (typeof content === "string" || typeof content === "number");

  if (!shouldTruncate) return content;

  const text = String(content);
  if (text === "—") return text;

  return (
    <TruncatedText maxChars={column.maxChars ?? TABLE_CELL_MAX_CHARS}>
      {text}
    </TruncatedText>
  );
}

export function toDetailRecord<T>(row: T): Record<string, unknown> {
  if (row != null && typeof row === "object") {
    return row as Record<string, unknown>;
  }
  return { value: row as unknown };
}
