import { VendorStrip } from "@/shared/components/VendorStrip.component";
import { RatingStars } from "@/shared/components/RatingStars.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { Badge } from "@/shared/components/ui/badge";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import type { ProductDetail } from "@/shared/api/types";

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

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {product.brand ? <TextEyebrow>{product.brand}</TextEyebrow> : null}
          {product.category?.name || product.categoryName ? (
            <TextEyebrow>
              {product.category?.name ?? product.categoryName}
            </TextEyebrow>
          ) : null}
        </div>

        <h1
          className="font-display font-semibold leading-[1.15] tracking-tight text-ink"
          style={{ fontSize: "var(--text-display-sm)" }}
        >
          {product.name}
        </h1>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <RatingStars value={avgRating} count={reviewCount} size="md" />
          {reviewCount > 0 ? (
            <a
              href="#reviews"
              className="text-body-sm text-ink-muted underline-offset-2 hover:text-brand hover:underline"
              onClick={onReviewsClick}
            >
              {formatLabel(LABELS.reviewsWithCount, {
                count: reviewCount,
              })}
            </a>
          ) : null}
        </div>

        {product.tags?.length ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.tags.slice(0, 4).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-full font-normal"
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
