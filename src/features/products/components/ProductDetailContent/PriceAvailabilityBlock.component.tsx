import { Badge } from "@/shared/components/ui/badge";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInrAmount } from "@/shared/utils/orderFormat";

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
    <div className="flex flex-wrap items-end justify-between gap-3 border-y border-line py-4">
      <div aria-live="polite" className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-sans text-[1.875rem] font-semibold leading-none text-brand">
            ₹{formattedPrice}
          </p>
          {discountPercent != null && discountPercent > 0 ? (
            <Badge variant="destructive" className="rounded-full">
              {formatLabel(LABELS.discountPercentOff, {
                percent: discountPercent,
              })}
            </Badge>
          ) : null}
        </div>
        {showMrp && compareAtPrice != null ? (
          <p className="text-body text-ink-faint">
            <span className="mr-1.5">{LABELS.listPrice}:</span>
            <span className="line-through">
              ₹{formatInrAmount(compareAtPrice)}
            </span>
          </p>
        ) : hasPriceChange ? (
          <p className="text-body text-ink-faint line-through">
            ₹{formatInrAmount(basePrice)}
          </p>
        ) : null}
        {gstPercentage > 0 ? (
          <p className="text-body-sm text-ink-muted">
            {formatLabel(LABELS.taxExclusiveGst, {
              percent: gstPercentage,
            })}
          </p>
        ) : null}
        {hsnCode ? (
          <p className="text-body-sm text-ink-muted">
            {formatLabel(LABELS.hsnCodeLabel, {
              code: hsnCode,
            })}
          </p>
        ) : null}
        {taxInclusiveEstimate != null ? (
          <p className="text-body-sm text-ink-faint">
            {formatLabel(LABELS.taxInclusiveEstimate, {
              amount: formatInrAmount(taxInclusiveEstimate),
            })}
          </p>
        ) : null}
        {sku ? (
          <p className="text-body-sm text-ink-muted">
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
