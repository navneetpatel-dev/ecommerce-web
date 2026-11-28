import type {
  InfiniteSingleSelectOption,
  InfiniteSingleSelectPageResult,
} from "@/shared/components/InfiniteSingleSelect";
import type { PaginatedList } from "@/shared/api/client/pagination";
import type { VendorInfo } from "@/shared/api/types";
import type { VendorDirectoryItem } from "@/features/vendors";

/** "@slug · State · #abc123": the second line under a vendor's name in the filter list. */
export function formatVendorSublabel(v: VendorInfo): string {
  const parts: string[] = [];
  if (v.slug) parts.push(`@${v.slug}`);
  if (v.state) parts.push(v.state);
  parts.push(`#${v.id.slice(0, 6)}`);
  return parts.join(" · ");
}

/** A vendor from the full admin list. */
export function vendorInfoToOption(v: VendorInfo): InfiniteSingleSelectOption {
  return {
    id: v.id,
    label: v.businessName,
    sublabel: formatVendorSublabel(v),
  };
}

/** A vendor from the approved-vendor directory (everyone else): the name is all it carries. */
export function directoryItemToOption(
  v: VendorDirectoryItem,
): InfiniteSingleSelectOption {
  return { id: v.id, label: v.businessName };
}

export function toPageResult<T>(
  res: PaginatedList<T>,
  toOption: (item: T) => InfiniteSingleSelectOption,
): InfiniteSingleSelectPageResult {
  return {
    items: res.items.map(toOption),
    page: res.page,
    totalPages: res.totalPages,
    total: res.total,
  };
}
