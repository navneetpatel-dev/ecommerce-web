import { LABELS } from "@/shared/constants/labels";
import { productDetailsMiscStyles } from "../../styles/detail/productDetailsMisc.styles";

interface ProductHighlightsProps {
  highlights?: string[] | null;
}

export function ProductHighlights({ highlights }: ProductHighlightsProps) {
  const cleanHighlights = (highlights ?? [])
    .map((item) =>
      typeof item === "string" ? item.trim() : String(item ?? "").trim(),
    )
    .filter(Boolean);

  if (!cleanHighlights.length) return null;

  return (
    <section className={productDetailsMiscStyles.highlightsSection}>
      <h3 className={productDetailsMiscStyles.highlightsHeading}>
        {LABELS.productHighlights}
      </h3>
      <ul className={productDetailsMiscStyles.highlightsGrid}>
        {cleanHighlights.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className={productDetailsMiscStyles.highlightsItem}
          >
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
