import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";
import type { PriceGuide } from "../../types/product-editor/types";
import type { ProductListingFormValues } from "../../schemas/listing-form/products.schema";
import type { useGstPricePreview } from "../../api/listing/products.queries";

/** The price and MRP hints under the editor's fields, from the server's GST preview. */
export function buildPriceGuide(
  values: Pick<ProductListingFormValues, "categoryId" | "price">,
  gstPreview: ReturnType<typeof useGstPricePreview>["data"],
): PriceGuide {
  const previewReady = Boolean(
    gstPreview && values.categoryId && values.price !== "",
  );
  const customerPrice = previewReady ? gstPreview!.displayPrice : null;
  const missing: PriceGuide["missing"] = !values.categoryId
    ? "category"
    : values.price === ""
      ? "price"
      : null;
  return {
    missing,
    priceHint: previewReady
      ? formatLabel(LABELS.productPriceBreakdown, {
          price: values.price,
          percent: gstPreview!.gstPercentage,
          amount: formatInrAmount(gstPreview!.displayPrice),
        })
      : !values.categoryId
        ? LABELS.productPriceNeedsCategory
        : LABELS.productPriceGstHint,
    mrpHint: !previewReady
      ? !values.categoryId
        ? LABELS.productMrpNeedsCategory
        : LABELS.productMrpHint
      : gstPreview!.showMrp && gstPreview!.discountPercent != null
        ? formatLabel(LABELS.productMrpShownHint, {
            mrp: formatInrAmount(gstPreview!.compareAtPrice),
            percent: gstPreview!.discountPercent,
          })
        : formatLabel(LABELS.productMrpMinimumHint, {
            amount: formatInrAmount(gstPreview!.displayPrice),
          }),
    preview: previewReady
      ? {
          displayPrice: gstPreview!.displayPrice,
          gstPercentage: gstPreview!.gstPercentage,
          compareAtPrice: gstPreview!.compareAtPrice ?? null,
          showMrp: Boolean(gstPreview!.showMrp),
          discountPercent: gstPreview!.discountPercent ?? null,
          savings: gstPreview!.savings ?? null,
        }
      : null,
    customerPrice,
  };
}
