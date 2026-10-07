import { FileSpreadsheet, FileText, ImageIcon, Upload } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type FilePickerIconVariant = "csv" | "document" | "image" | "generic";

function isSpreadsheetAccept(accept?: string): boolean {
  return Boolean(
    accept?.includes(".csv") ||
    accept?.includes("text/csv") ||
    accept?.includes(".xlsx") ||
    accept?.includes("spreadsheet"),
  );
}

/** Resolve which icon variant a FilePicker should show from its accept list. */
export function resolveFilePickerVariant(
  accept: string | undefined,
  iconVariant: FilePickerIconVariant | undefined,
): FilePickerIconVariant {
  if (iconVariant) return iconVariant;
  if (isSpreadsheetAccept(accept)) return "csv";
  if (accept?.includes("image")) return "image";
  if (accept?.includes("pdf")) return "document";
  return "generic";
}

export function resolveFilePickerIcon(
  variant: FilePickerIconVariant,
): LucideIcon {
  if (variant === "csv") return FileSpreadsheet;
  if (variant === "document") return FileText;
  if (variant === "image") return ImageIcon;
  return Upload;
}
