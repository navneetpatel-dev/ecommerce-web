import { LABELS } from "@/shared/constants/labels";

export type TaxDisplayKey = "IGST" | "CGST_SGST" | "GST";

export function taxDisplayLabel(taxDisplayKey?: TaxDisplayKey): string {
  if (taxDisplayKey === "IGST") return LABELS.taxIgst;
  if (taxDisplayKey === "CGST_SGST") return LABELS.taxCgstSgst;
  return LABELS.taxGst;
}
