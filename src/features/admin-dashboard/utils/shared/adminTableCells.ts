import { LABELS } from "@/shared/constants/labels";
import { tryFormatDateTime } from "@/shared/utils/formatting/formatDate";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { formatReturnReason } from "@/features/returns";
import type { AdminDataRow } from "../../hooks/shared/useAdminDataList.hook";

const SKIP_COLUMN_KEYS = new Set([
  "id",
  "bankDetails",
  "passwordHash",
  "createdBy",
  "updatedBy",
  "deletedBy",
  "deletedAt",
  "metadata",
]);

/** Resolve `a.b.c` paths on admin list rows. */
export function getAdminCellValue(row: AdminDataRow, key: string): unknown {
  if (row == null || typeof row !== "object") return undefined;
  if (!key.includes(".")) return row[key];
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc == null || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[part];
  }, row);
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Prefer human labels over UUIDs / nested association dumps. */
export function formatAdminCellValue(value: unknown): string {
  if (value == null || value === "") return "—";
  if (typeof value === "string" && UUID_REGEX.test(value)) return "—";
  const asDate = tryFormatDateTime(value);
  if (asDate) return asDate;
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const text = obj.businessName ?? obj.name ?? obj.email ?? obj.code;
    if (typeof text === "string" && text.trim()) return text;
    if (Array.isArray(value)) {
      if (value.length === 0) return "—";
      return value
        .map(formatAdminCellValue)
        .filter((i) => i !== "—")
        .join(", ");
    }
    return "—";
  }
  if (typeof value === "boolean") return value ? LABELS.yes : LABELS.no;
  return String(value);
}

export function shouldInferAdminColumn(key: string): boolean {
  return !SKIP_COLUMN_KEYS.has(key) && key !== "id" && !key.endsWith("Id");
}

const isMoneyColumnKey = (key: string): boolean => {
  const lower = key.toLowerCase();
  if (
    lower.includes("count") ||
    lower.includes("quantity") ||
    lower.includes("rate")
  ) {
    return false;
  }
  return (
    key === "totalAmount" ||
    key === "subtotal" ||
    key === "price" ||
    key === "amount" ||
    key === "priceBandThreshold" ||
    key.endsWith("Amount") ||
    key.endsWith("Price") ||
    key.endsWith("Total") ||
    key.endsWith("Fee") ||
    key.endsWith("Balance")
  );
};

/** Plain-text admin cell formatted appropriately for table & phone cards. */
export function adminCellText(row: AdminDataRow, columnKey: string): string {
  if (row == null || typeof row !== "object") return "—";
  const value = getAdminCellValue(row, columnKey);

  if (columnKey === "returnReference") {
    const raw =
      typeof value === "string" && value.trim()
        ? value
        : typeof row.id === "string"
          ? `#RET-${row.id.slice(0, 8).toUpperCase()}`
          : "";
    return raw ? (raw.startsWith("#") ? raw : `#${raw}`) : "—";
  }
  if (columnKey === "reasonCode" && typeof value === "string" && value.trim()) {
    return formatReturnReason(value);
  }
  if (columnKey === "orderReference" || columnKey === "reference") {
    const raw =
      typeof value === "string" && value.trim()
        ? value
        : typeof row.id === "string"
          ? row.id.slice(0, 8).toUpperCase()
          : "";
    return raw ? `#${raw.replace(/^#/, "")}` : "—";
  }
  if (columnKey === "discountValue" || columnKey === "cashbackValue") {
    const typeKey =
      columnKey === "discountValue" ? "discountType" : "cashbackType";
    const type = String(row[typeKey] ?? "").toLowerCase();
    if (value != null && value !== "" && !isNaN(Number(value))) {
      return type === "percentage"
        ? `${Number(value)}%`
        : formatInr(Number(value));
    }
  }
  if (isMoneyColumnKey(columnKey)) {
    if (
      typeof value === "number" ||
      (typeof value === "string" &&
        !isNaN(Number(value)) &&
        value.trim() !== "")
    ) {
      return formatInr(Number(value));
    }
  }
  if (
    columnKey === "gstPercentage" ||
    columnKey === "gstPercentageAbove" ||
    columnKey.endsWith("Percentage") ||
    columnKey === "commissionRate"
  ) {
    if (value != null && value !== "" && !isNaN(Number(value)))
      return `${Number(value)}%`;
  }
  if (columnKey === "id" && typeof value === "string" && value.trim()) {
    const h =
      row.name ??
      row.businessName ??
      row.productName ??
      row.title ??
      row.customerName;
    return typeof h === "string" && h.trim() ? h : "—";
  }
  if (columnKey.endsWith("Id") && typeof value === "string") {
    const base = columnKey.slice(0, -2);
    const cand =
      row[`${base}Name`] ??
      row[`${base}Title`] ??
      row.name ??
      row.businessName ??
      row.productName;
    if (typeof cand === "string" && cand.trim()) return cand;
  }
  return formatAdminCellValue(value);
}
