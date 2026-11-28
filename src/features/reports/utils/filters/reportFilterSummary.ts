import { LABELS } from "@/shared/constants/labels";
import type { ReportCatalogItem } from "../../api/table/reportsEngine.api";

interface ReportFilterValues {
  selectedItem?: ReportCatalogItem;
  labelForKey: (key: string) => string;
  from: string;
  to: string;
  vendorId: string;
  categoryId: string;
  status: string;
}

/** How many report filters are set, and the one-line summary shown when they are folded. */
export function reportFilterSummary({
  selectedItem,
  labelForKey,
  from,
  to,
  vendorId,
  categoryId,
  status,
}: ReportFilterValues) {
  const activeCount = [from, to, vendorId, categoryId, status].filter((v) =>
    v.trim(),
  ).length;
  const summaryText = [
    selectedItem ? labelForKey(selectedItem.labelKey) : "",
    from || to ? `${from || "…"} – ${to || "…"}` : "",
    vendorId ? LABELS.reportVendor : "",
    categoryId ? LABELS.reportCategory : "",
    status ? `${LABELS.reportFilterSummaryStatus}: ${status}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
  return { activeCount, summaryText };
}
