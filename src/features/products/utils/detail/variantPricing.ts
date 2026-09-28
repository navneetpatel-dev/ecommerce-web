import { VARIANT_LOW_STOCK_DEFAULT } from "../../constants/listing-form/productFields";
import { customerPrice } from "@/shared/utils/pricing/customerPrice";
import type { ProductDetailContentProps } from "../../types/detail/types";

type DetailProduct = ProductDetailContentProps["product"];
type VariantSelection = ProductDetailContentProps["variantSelection"];

/** The variant whose figures the PDP shows: the picked one, or the only one. */
export function pickResolvedVariant(
  product: DetailProduct,
  variantSelection: VariantSelection,
) {
  return (
    variantSelection.matchedVariant ??
    (product.variants?.length === 1 ? product.variants[0] : null)
  );
}

export interface VariantPricing {
  resolvedVariant: ReturnType<typeof pickResolvedVariant>;
  displayPrice: number;
  displayStock: number;
  taxInclusiveEstimate: number | null;
  showMrp: boolean;
  discountPercent: number | null;
  lowStockAt: number;
}

/**
 * Price, stock and the API-computed variant figures. The selected variant wins
 * wherever the API computed it; the product's own value until one is picked.
 */
export function resolveVariantPricing(
  product: DetailProduct,
  variantSelection: VariantSelection,
): VariantPricing {
  const resolvedVariant = pickResolvedVariant(product, variantSelection);
  const variantHasMrpDiscount = resolvedVariant?.showMrp !== undefined;

  return {
    resolvedVariant,
    displayPrice: Number(
      variantSelection.currentPrice || customerPrice(product) || 0,
    ),
    displayStock: Number(variantSelection.currentStock || product.stock || 0),
    taxInclusiveEstimate:
      resolvedVariant?.taxInclusivePrice !== undefined
        ? (resolvedVariant.taxInclusivePrice ?? null)
        : (product.taxInclusivePrice ?? null),
    showMrp: variantHasMrpDiscount
      ? Boolean(resolvedVariant?.showMrp)
      : (product.showMrp ?? false),
    discountPercent: variantHasMrpDiscount
      ? (resolvedVariant?.discountPercent ?? null)
      : (product.discountPercent ?? null),
    lowStockAt: Number(
      resolvedVariant?.lowStockAt ?? VARIANT_LOW_STOCK_DEFAULT,
    ),
  };
}
