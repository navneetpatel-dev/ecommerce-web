import { LABELS } from "@/shared/constants/labels";
import { tryFormatDateTime } from "@/shared/utils/formatting/formatDate";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
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

function isIdLikeKey(key: string): boolean {
  return key === "id" || key.endsWith("Id");
}

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
    if (typeof obj.businessName === "string" && obj.businessName.trim())
      return obj.businessName;
    if (typeof obj.name === "string" && obj.name.trim()) return obj.name;
    if (typeof obj.email === "string" && obj.email.trim()) return obj.email;
    if (typeof obj.code === "string" && obj.code.trim()) return obj.code;
    if (Array.isArray(value)) {
      if (value.length === 0) return "—";
      return value
        .map((item) => formatAdminCellValue(item))
        .filter((item) => item !== "—")
        .join(", ");
    }
    return "—";
  }
  if (typeof value === "boolean") return value ? LABELS.yes : LABELS.no;
  return String(value);
}

export function shouldInferAdminColumn(key: string): boolean {
  if (SKIP_COLUMN_KEYS.has(key)) return false;
  if (isIdLikeKey(key)) return false;
  return true;
}

const isMoneyColumnKey = (key: string): boolean => {
  const lower = key.toLowerCase();
  if (lower.includes("count") || lower.includes("quantity")) return false;
  return (
    key === "totalAmount" ||
    key === "subtotal" ||
    key === "price" ||
    key === "amount" ||
    key.endsWith("Amount") ||
    key.endsWith("Price") ||
    key.endsWith("Total") ||
    key.endsWith("Fee")
  );
};

/**
 * A plain-text admin cell (not an image, not a status badge) as a string, so
 * the table treats it as text: cut short with the full value on hover in the
 * desktop table, shown in full on phone cards. Wrapped in a component it would
 * skip that and long text (a review, an answer) would spill into the next column.
 */
export function adminCellText(row: AdminDataRow, columnKey: string): string {
  if (row == null || typeof row !== "object") return "—";
  const value = getAdminCellValue(row, columnKey);

  if (columnKey === "orderReference" || columnKey === "reference") {
    const ref =
      typeof value === "string" && value.trim()
        ? value
        : typeof row.id === "string"
          ? row.id.slice(0, 8).toUpperCase()
          : "";
    return ref ? `#${ref.replace(/^#/, "")}` : "—";
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

  if (columnKey === "id" && typeof value === "string" && value.trim()) {
    const humanName =
      row.name ??
      row.businessName ??
      row.productName ??
      row.title ??
      row.customerName;
    return typeof humanName === "string" && humanName.trim() ? humanName : "—";
  }
  if (columnKey.endsWith("Id") && typeof value === "string") {
    const base = columnKey.slice(0, -2);
    const candidateName =
      row[`${base}Name`] ??
      row[`${base}Title`] ??
      row.name ??
      row.businessName ??
      row.productName;
    if (typeof candidateName === "string" && candidateName.trim()) {
      return candidateName;
    }
  }
  return formatAdminCellValue(value);
}
