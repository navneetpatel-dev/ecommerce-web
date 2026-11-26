import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { CustomerPricePreviewData } from "../../types/product-editor/types";

/** A discount above this looks suspicious to shoppers. */
export const HIGH_DISCOUNT_PERCENT = 70;
/** A discount below this is rarely noticed. */
export const SMALL_DISCOUNT_PERCENT = 5;

/** A short suggestion about the discount the preview shows, or null when it looks fine. */
export function priceNudge(preview: CustomerPricePreviewData): string | null {
  if (!preview.showMrp || preview.discountPercent == null) {
    return preview.compareAtPrice == null ? LABELS.customerPriceNoMrp : null;
  }
  const percent = preview.discountPercent;
  if (percent >= HIGH_DISCOUNT_PERCENT) {
    return formatLabel(LABELS.customerPriceHighDiscount, { percent });
  }
  if (percent < SMALL_DISCOUNT_PERCENT) {
    return formatLabel(LABELS.customerPriceSmallDiscount, { percent });
  }
  return null;
}
