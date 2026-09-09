import { LABELS } from "@/shared/constants/labels";
import { productDetailsMiscStyles } from "./productDetailsMisc.styles";

interface ProductHighlightsProps {
  highlights?: string[] | null;
}

export function ProductHighlights({ highlights }: ProductHighlightsProps) {
  if (!highlights?.length) return null;

  return (
    <section className={productDetailsMiscStyles.highlightsSection}>
      <h3 className={productDetailsMiscStyles.highlightsHeading}>
        {LABELS.productHighlights}
      </h3>
      <ul className={productDetailsMiscStyles.highlightsGrid}>
        {highlights.map((item) => (
          <li key={item} className={productDetailsMiscStyles.highlightsItem}>
            <span
              className={productDetailsMiscStyles.highlightsBullet}
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
