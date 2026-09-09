import { VendorStrip } from "@/shared/components/VendorStrip.component";
import { RatingStars } from "@/shared/components/RatingStars.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { Badge } from "@/shared/components/ui/badge";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import type { ProductDetail } from "@/shared/api/types";
import { PRODUCT_DETAIL_CONTENT_STYLES } from "./productDetailContent.styles";

interface ProductHeadingBlockProps {
  product: ProductDetail;
  sellerScore: number | null;
  avgRating: number;
  reviewCount: number;
  onReviewsClick: () => void;
}

export function ProductHeadingBlock({
  product,
  sellerScore,
  avgRating,
  reviewCount,
  onReviewsClick,
}: ProductHeadingBlockProps) {
  return (
    <>
      {product.vendor ? (
        <VendorStrip
          vendor={product.vendor}
          size="md"
          rating={sellerScore == null ? undefined : sellerScore}
        />
      ) : null}

      <div className={PRODUCT_DETAIL_CONTENT_STYLES.headingStack}>
        <div className={PRODUCT_DETAIL_CONTENT_STYLES.eyebrowsRow}>
          {product.brand ? <TextEyebrow>{product.brand}</TextEyebrow> : null}
          {product.category?.name || product.categoryName ? (
            <TextEyebrow>
              {product.category?.name ?? product.categoryName}
            </TextEyebrow>
          ) : null}
        </div>

        <h1
          className={PRODUCT_DETAIL_CONTENT_STYLES.headingTitle}
          style={{ fontSize: "var(--text-display-sm)" }}
        >
          {product.name}
        </h1>

        <div className={PRODUCT_DETAIL_CONTENT_STYLES.ratingRow}>
          <RatingStars value={avgRating} count={reviewCount} size="md" />
          {reviewCount > 0 ? (
            <a
              href="#reviews"
              className={PRODUCT_DETAIL_CONTENT_STYLES.reviewsLink}
              onClick={onReviewsClick}
            >
              {formatLabel(LABELS.reviewsWithCount, {
                count: reviewCount,
              })}
            </a>
          ) : null}
        </div>

        {product.tags?.length ? (
          <div className={PRODUCT_DETAIL_CONTENT_STYLES.tagsRow}>
            {product.tags.slice(0, 4).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className={PRODUCT_DETAIL_CONTENT_STYLES.tagBadge}
              >
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
