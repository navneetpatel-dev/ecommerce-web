import { z } from "zod";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { UgcLimit } from "@/shared/constants/ugc/ugcLimits";

/** Trimmed shopper text with the same limits and wording the API uses. */
export function ugcTextSchema(label: string, limits: UgcLimit) {
  let schema = z.string().trim();
  if (limits.min > 0) {
    schema = schema.min(
      limits.min,
      formatLabel(LABELS.ugcTooShort, { label, min: limits.min }),
    );
  }
  return schema.max(
    limits.max,
    formatLabel(LABELS.ugcTooLong, { label, max: limits.max }),
  );
}

/** Whether trimmed text is within limits (drives the submit button). */
export function isUgcTextValid(text: string, limits: UgcLimit): boolean {
  const length = text.trim().length;
  return length >= Math.max(limits.min, 1) && length <= limits.max;
}
