import { Badge } from "@/shared/components/ui/badge";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInrAmount } from "@/shared/utils/orderFormat";
import { PRODUCT_DETAIL_CONTENT_STYLES } from "./productDetailContent.styles";

interface PriceAvailabilityBlockProps {
  formattedPrice: string;
  compareAtPrice: number | null;
  showMrp: boolean;
  discountPercent: number | null;
  hasPriceChange: boolean;
  basePrice: number;
  gstPercentage: number;
  taxInclusiveEstimate: number | null;
  hsnCode: string | null | undefined;
  sku: string | undefined;
  needsOptionSelection: boolean;
  variantUnavailable: boolean;
  displayStock: number;
  lowStockAt: number;
}

export function PriceAvailabilityBlock({
  formattedPrice,
  compareAtPrice,
  showMrp,
  discountPercent,
  hasPriceChange,
  basePrice,
  gstPercentage,
  taxInclusiveEstimate,
  hsnCode,
  sku,
  needsOptionSelection,
  variantUnavailable,
  displayStock,
  lowStockAt,
}: PriceAvailabilityBlockProps) {
  return (
    <div className={PRODUCT_DETAIL_CONTENT_STYLES.priceRow}>
      <div
        aria-live="polite"
        className={PRODUCT_DETAIL_CONTENT_STYLES.priceStack}
      >
        <div className={PRODUCT_DETAIL_CONTENT_STYLES.priceLine}>
          <p className={PRODUCT_DETAIL_CONTENT_STYLES.priceText}>
            ₹{formattedPrice}
          </p>
          {discountPercent != null && discountPercent > 0 ? (
            <Badge
              variant="destructive"
              className={PRODUCT_DETAIL_CONTENT_STYLES.discountBadge}
            >
              {formatLabel(LABELS.discountPercentOff, {
                percent: discountPercent,
              })}
            </Badge>
          ) : null}
        </div>
        {showMrp && compareAtPrice != null ? (
          <p className={PRODUCT_DETAIL_CONTENT_STYLES.listPriceText}>
            <span className={PRODUCT_DETAIL_CONTENT_STYLES.listPriceLabel}>
              {LABELS.listPrice}:
            </span>
            <span className={PRODUCT_DETAIL_CONTENT_STYLES.strikeThrough}>
              ₹{formatInrAmount(compareAtPrice)}
            </span>
          </p>
        ) : hasPriceChange ? (
          <p className={PRODUCT_DETAIL_CONTENT_STYLES.listPriceStrike}>
            ₹{formatInrAmount(basePrice)}
          </p>
        ) : null}
        {gstPercentage > 0 ? (
          <p className={PRODUCT_DETAIL_CONTENT_STYLES.gstText}>
            {formatLabel(LABELS.taxExclusiveGst, {
              percent: gstPercentage,
            })}
          </p>
        ) : null}
        {hsnCode ? (
          <p className={PRODUCT_DETAIL_CONTENT_STYLES.hsnText}>
            {formatLabel(LABELS.hsnCodeLabel, {
              code: hsnCode,
            })}
          </p>
        ) : null}
        {taxInclusiveEstimate != null ? (
          <p className={PRODUCT_DETAIL_CONTENT_STYLES.taxEstimateText}>
            {formatLabel(LABELS.taxInclusiveEstimate, {
              amount: formatInrAmount(taxInclusiveEstimate),
            })}
          </p>
        ) : null}
        {sku ? (
          <p className={PRODUCT_DETAIL_CONTENT_STYLES.skuText}>
            {LABELS.sku}: {sku}
          </p>
        ) : null}
      </div>
      {needsOptionSelection ? null : displayStock === 0 ||
        variantUnavailable ? (
        <Badge variant="destructive">
          {variantUnavailable ? LABELS.notAvailable : LABELS.outOfStock}
        </Badge>
      ) : displayStock <= lowStockAt ? (
        <Badge variant="destructive">
          {formatLabel(LABELS.onlyLeft, { count: displayStock })}
        </Badge>
      ) : (
        <Badge variant="success">{LABELS.inStock}</Badge>
      )}
    </div>
  );
}
