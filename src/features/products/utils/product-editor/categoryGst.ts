import { LABELS } from "@/shared/constants/labels";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { CategoryPickerItem } from "../../api/listing/products.api";
import type {
  CategoryGst,
  CategoryOptionData,
} from "../../types/product-editor/types";

/** A category from the picker API, as the form's option. */
export function pickerItemToCategory(
  item: CategoryPickerItem,
): CategoryOptionData {
  return {
    id: item.id,
    name: item.name,
    depth: item.depth,
    imageUrl: item.imageUrl,
    path: item.path,
    gst: {
      percent: item.gstPercentage,
      abovePercent: item.gstPercentageAbove,
      threshold: item.priceBandThreshold,
    },
  };
}

/** The short pill ("18% GST", or "5–12% GST" when the rate changes with price) and its tooltip. */
export function gstBadge(gst: CategoryGst): { text: string; title?: string } {
  if (gst.abovePercent != null && gst.threshold != null) {
    return {
      text: formatLabel(LABELS.gstBadgeBand, {
        from: gst.percent,
        to: gst.abovePercent,
      }),
      title: formatLabel(LABELS.gstBadgeBandTitle, {
        from: gst.percent,
        threshold: formatInrAmount(gst.threshold),
        to: gst.abovePercent,
      }),
    };
  }
  return { text: formatLabel(LABELS.gstBadge, { percent: gst.percent }) };
}

/** What the closed field shows: "Cookware · 12% GST". */
export function categoryFieldLabel(category: CategoryOptionData): string {
  return category.gst
    ? `${category.name} · ${gstBadge(category.gst).text}`
    : category.name;
}
