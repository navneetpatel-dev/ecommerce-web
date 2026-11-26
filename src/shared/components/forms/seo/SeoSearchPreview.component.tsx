"use client";

import { Info } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { seoFieldsStyles as styles } from "@/shared/styles/forms/seoFields.styles";
import { seoPreviewText } from "@/shared/utils/seo/seoPreview";

interface SeoSearchPreviewProps {
  seoTitle: string;
  seoDescription: string;
  /** Used when the SEO field is empty: the name and description of the thing being edited. */
  fallbackTitle: string;
  fallbackDescription: string;
}

/** How the page could look in a search result, updated as the person types. */
export function SeoSearchPreview({
  seoTitle,
  seoDescription,
  fallbackTitle,
  fallbackDescription,
}: SeoSearchPreviewProps) {
  const preview = seoPreviewText({
    seoTitle,
    seoDescription,
    name: fallbackTitle,
    description: fallbackDescription,
  });
  return (
    <div className={styles.preview} role="note" aria-live="polite">
      <Info className={styles.previewIcon} aria-hidden />
      <div className={styles.previewBody}>
        <p className={styles.previewCaption}>{LABELS.seoPreviewCaption}</p>
        <div className={styles.previewResult}>
          <p className={styles.previewUrl}>{LABELS.seoPreviewUrl}</p>
          <p className={styles.previewTitle}>
            {preview.title || LABELS.seoPreviewTitleEmpty}
          </p>
          <p className={styles.previewDescription}>
            {preview.description || LABELS.seoPreviewDescriptionEmpty}
          </p>
        </div>
        {preview.usesFallback ? (
          <p className={styles.previewNote}>{LABELS.seoPreviewFallbackNote}</p>
        ) : null}
      </div>
    </div>
  );
}
