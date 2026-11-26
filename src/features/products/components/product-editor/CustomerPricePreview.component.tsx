"use client";

import { Badge } from "@/shared/components/ui/badge";
import { MoneyAmount } from "@/shared/components/display/MoneyAmount.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";
import { PRODUCT_DETAIL_CONTENT_STYLES as pdp } from "../../styles/detail/productDetailContent.styles";
import { productEditorFormStyles as styles } from "../../styles/product-editor/productEditorForm.styles";
import type { CustomerPricePreviewData } from "../../types/product-editor/types";
import { priceNudge } from "../../utils/product-editor/priceNudge";

interface CustomerPricePreviewProps {
  preview: CustomerPricePreviewData | null;
  /** Why there is nothing to show yet. */
  missing?: "category" | "price" | null;
}

/**
 * The price block of the customer's product page, live: the GST-inclusive price, the struck-through
 * MRP and the "% off" badge, plus what the customer saves. Every figure is computed by the API with
 * the same code as the storefront; this only lays them out the way the page does.
 */
export function CustomerPricePreview({
  preview,
  missing = null,
}: CustomerPricePreviewProps) {
  if (!preview) {
    return (
      <div className={styles.pricePreview}>
        <p className={styles.pricePreviewTitle}>{LABELS.customerPriceTitle}</p>
        <p className={styles.pricePreviewNote}>
          {missing === "price"
            ? LABELS.customerPriceNeedsPrice
            : LABELS.customerPriceNeedsCategory}
        </p>
      </div>
    );
  }
  const nudge = priceNudge(preview);
  const discount = preview.showMrp ? preview.discountPercent : null;

  return (
    <div className={styles.pricePreview} aria-live="polite">
      <p className={styles.pricePreviewTitle}>{LABELS.customerPriceTitle}</p>
      <div className={styles.pricePreviewLine}>
        <span className={styles.pricePreviewPrice}>
          <MoneyAmount value={preview.displayPrice} />
        </span>
        {discount != null && discount > 0 ? (
          <Badge variant="destructive" className={pdp.discountBadge}>
            {formatLabel(LABELS.discountPercentOff, { percent: discount })}
          </Badge>
        ) : null}
        {preview.showMrp && preview.compareAtPrice != null ? (
          <span className={styles.pricePreviewMrp}>
            {LABELS.listPrice}:{" "}
            <span className={pdp.strikeThrough}>
              <MoneyAmount value={preview.compareAtPrice} />
            </span>
          </span>
        ) : null}
      </div>
      <p className={styles.pricePreviewMeta}>
        <span>
          {formatLabel(LABELS.taxInclusiveGst, {
            percent: preview.gstPercentage,
          })}
        </span>
        {preview.savings != null ? (
          <span className={styles.pricePreviewSavings}>
            {formatLabel(LABELS.customerPriceSavings, {
              amount: formatInrAmount(preview.savings),
            })}
          </span>
        ) : null}
      </p>
      {nudge ? <p className={styles.pricePreviewNote}>{nudge}</p> : null}
    </div>
  );
}
