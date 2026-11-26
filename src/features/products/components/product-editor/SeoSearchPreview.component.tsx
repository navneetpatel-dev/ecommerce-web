"use client";

import { Info } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import type { ProductListingFormValues } from "../../schemas/listing-form/products.schema";
import { seoPreviewText } from "../../utils/product-editor/seoPreview";
import { productEditorFormStyles as styles } from "../../styles/product-editor/productEditorForm.styles";

interface SeoSearchPreviewProps {
  values: ProductListingFormValues;
}

/** How the listing could look in a search result, updated as the person types. */
export function SeoSearchPreview({ values }: SeoSearchPreviewProps) {
  const preview = seoPreviewText(values);
  return (
    <div className={styles.seoPreview} role="note" aria-live="polite">
      <Info className={styles.seoPreviewIcon} aria-hidden />
      <div className={styles.seoPreviewBody}>
        <p className={styles.seoPreviewCaption}>{LABELS.seoPreviewCaption}</p>
        <div className={styles.seoPreviewResult}>
          <p className={styles.seoPreviewUrl}>{LABELS.seoPreviewUrl}</p>
          <p className={styles.seoPreviewTitle}>
            {preview.title || LABELS.seoPreviewTitleEmpty}
          </p>
          <p className={styles.seoPreviewDescription}>
            {preview.description || LABELS.seoPreviewDescriptionEmpty}
          </p>
        </div>
        {preview.usesFallback ? (
          <p className={styles.seoPreviewNote}>
            {LABELS.seoPreviewFallbackNote}
          </p>
        ) : null}
      </div>
    </div>
  );
}
