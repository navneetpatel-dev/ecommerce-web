import { LABELS } from "@/shared/constants/labels";
import {
  isBlankDraft,
  toVariantBody,
  validateVariantDraft,
  variantMessages,
  type VariantDraft,
  type VariantDraftErrors,
} from "./variantDrafts";

/** The filled variant rows as request bodies, and what is wrong with any incomplete one. */
export function collectVariants(rows: VariantDraft[]) {
  const filled = rows.filter((row) => !isBlankDraft(row));
  const errors: Record<string, VariantDraftErrors> = {};
  for (const row of filled) {
    const rowErrors = validateVariantDraft(row, variantMessages(LABELS));
    if (Object.keys(rowErrors).length) errors[row.key] = rowErrors;
  }
  const valid = Object.keys(errors).length === 0;
  return { errors, bodies: valid ? filled.map(toVariantBody) : null };
}
